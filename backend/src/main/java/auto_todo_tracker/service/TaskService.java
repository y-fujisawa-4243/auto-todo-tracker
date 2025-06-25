package auto_todo_tracker.service;

import auto_todo_tracker.exception.BadRequestException;
import auto_todo_tracker.exception.ConflictException;
import auto_todo_tracker.exception.ResourceNotFoundException;
import auto_todo_tracker.exception.TaskLimitException;

import auto_todo_tracker.model.dto.PatchTaskDTO;
import auto_todo_tracker.model.dto.PostTaskDTO;
import auto_todo_tracker.model.dto.TaskDTO;
import auto_todo_tracker.model.entity.*;

import auto_todo_tracker.repository.SessionRepository;
import auto_todo_tracker.repository.TaskRepository;
import auto_todo_tracker.repository.UsersRepository;
import auto_todo_tracker.util.SecurityUtil;

import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;


@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final SessionRepository sessionRepository;
    private final UsersRepository usersRepository;


    //コンストラクタ
    public TaskService(TaskRepository taskRepository, 
                       SessionRepository sessionRepository,
                       UsersRepository usersRepository){
        this.taskRepository = taskRepository;
        this.sessionRepository = sessionRepository;
        this.usersRepository = usersRepository;
    }


    //タスク全取得処理
    public List<TaskDTO> getAllTaskDTOs(){

        //該当ユーザー取得
        SecurityUtil secUtil = new SecurityUtil(usersRepository);
        Long usersId = secUtil.getCurrentUser().getUsersId();

        //TaskEntity取得
        List<TaskEntity> taskWithSessionList = taskRepository.findByUsers_UsersIdWithSession(usersId);

        //Entity ⇒　DTOへ変換し返す
        return taskWithSessionList.stream()
                .map( task-> TaskDTO.toDTO(task,task.getSession()))
                .toList();

    }


    //新規タスクの追加
    public TaskDTO createTaskDTO(PostTaskDTO postTaskDTO){

        //該当ユーザー取得
        SecurityUtil secUtil = new SecurityUtil(usersRepository);
        Long usersId = secUtil.getCurrentUser().getUsersId();
        UsersEntity usersEntity = usersRepository.findByUsersId(usersId);

        //DTO ⇒ Entityに変換し保存
        TaskEntity taskEntity = postTaskDTO.toTaskEntity();
        SessionEntity sessionEntity = postTaskDTO.toSessionEntity();

        //タスク数検証
        long count = taskRepository.countByUsers_UsersId(usersId);
        if(count >= 50){
            throw new TaskLimitException("タスク数が上限に達しています。");
        }

        //リレーション
        taskEntity.setSession(sessionEntity);
        taskEntity.setUsers(usersEntity);
        sessionEntity.setTask(taskEntity);

        //保存
        TaskEntity newTaskEntity = taskRepository.save(taskEntity);
        SessionEntity newSessionEntity = sessionRepository.save(sessionEntity);

        //TaskDTOとして返す
        return TaskDTO.toDTO(newTaskEntity,newSessionEntity);
    }

    
    //指定タスクの削除
    public void deleteTaskById(Long taskId) throws AccessDeniedException {

        //該当ユーザー取得
        SecurityUtil secUtil = new SecurityUtil(usersRepository);
        long usersId = secUtil.getCurrentUser().getUsersId();

        //指定したIDに一致するタスクがあるか
        TaskEntity taskEntity = taskRepository.findById(taskId)
                        .orElseThrow(() -> new ResourceNotFoundException("指定されたタスクが見つかりません"));

        //一致したタスクがそのユーザーのものか確認
        if (!(taskEntity.getUsers().getUsersId() == usersId)){
            throw new AccessDeniedException("タスク削除の権限がありません");
        }

        taskRepository.deleteById(taskId);

    }


    //指定タスクの更新
    public TaskDTO patchTaskById(Long taskId,PatchTaskDTO patchTaskDTO) throws AccessDeniedException {

        //該当ユーザー取得
        SecurityUtil secUtil = new SecurityUtil(usersRepository);
        long usersId = secUtil.getCurrentUser().getUsersId();

        //指定したIDに一致するタスクがあるか
        TaskEntity taskEntity = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("指定されたタスクが見つかりません"));

        //一致したタスクがそのユーザーのものか確認
        if (!(taskEntity.getUsers().getUsersId() == usersId)){
            throw new AccessDeniedException("タスク編集の権限がありません");
        }

        //バリデーション実施し、更新データを各Entityにまとめる。
        TaskWithSession tws = validDataPatchRequest(taskEntity, patchTaskDTO);
        return TaskDTO.toDTO(tws.getTaskEntity(),tws.getSessionEntity());

    }


    //PATCHリクエストに対するバリデーション処理
    public TaskWithSession validDataPatchRequest(TaskEntity taskEntity,PatchTaskDTO patchTaskDTO){

        final long MAX_ELAPSED_SEC = 359_999L;  //計測最大値定数

        SessionEntity sessionEntity = taskEntity.getSession();

        //更新データがあるフィールドのみ更新
        //タイトル
        if (patchTaskDTO.taskTitle() != null){
            if(patchTaskDTO.taskTitle().isBlank()){
                throw new BadRequestException("※タイトルは必須です");
            }
            if(patchTaskDTO.taskTitle().length() >20){
                throw new BadRequestException(("※タイトルは20文字以内で入力してください"));
            }
            taskEntity.setTaskTitle(patchTaskDTO.taskTitle());
        }

        //説明
        if (patchTaskDTO.taskDescription() != null){
            if(patchTaskDTO.taskDescription().length() >256){
                throw new BadRequestException(("※説明は256文字以内で入力してください"));
            }
            taskEntity.setTaskDescription(patchTaskDTO.taskDescription());
        }

        //taskStatusがRUNNING かつ 他にもRUNNINGのタスクが存在する場合はエラー
        if (patchTaskDTO.taskStatus() != null){
            if(patchTaskDTO.taskStatus() == TaskStatus.RUNNING &&
                    taskRepository.existsByUsers_UsersIdAndTaskStatusAndTaskIdNot(
                            taskEntity.getUsers().getUsersId(),
                            TaskStatus.RUNNING,
                            taskEntity.getTaskId()
                    )){
                throw  new ConflictException("作業中タスクがほかに存在します");
            }
            taskEntity.setTaskStatus(patchTaskDTO.taskStatus());
        }


        //計測
        System.out.println(patchTaskDTO.elapsedTime() );
        if(patchTaskDTO.elapsedTime() != 0) {
            if (patchTaskDTO.elapsedTime() < 0) {
                throw new BadRequestException("※計測時間[ms]はマイナスになりません");
            }

            if (patchTaskDTO.elapsedTime() > MAX_ELAPSED_SEC ) {     //359,999 = 99h59m59s
                throw new BadRequestException("※計測できる時間の限界に達しました");
            }

            sessionEntity.setElapsedTime(patchTaskDTO.elapsedTime());
        }

        //保存
        TaskEntity newTaskEntity = taskRepository.save(taskEntity);
        SessionEntity newSessionEntity = sessionRepository.save(sessionEntity);

        return new TaskWithSession(newTaskEntity,newSessionEntity);
    }

    //引数のタスクが認証されたユーザーのタスクか確認
    public boolean isUserOwnerOfTask(long taskId) {

        //該当ユーザー取得
        SecurityUtil secUtil = new SecurityUtil(usersRepository);
        Long usersId = secUtil.getCurrentUser().getUsersId();

        return taskRepository.existsByUsers_UsersIdAndTaskId(usersId,taskId);
    }
}
