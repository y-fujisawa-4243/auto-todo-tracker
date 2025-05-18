package auto_todo_tracker.service;

import auto_todo_tracker.exception.BadRequestException;
import auto_todo_tracker.exception.ConflictException;
import auto_todo_tracker.exception.ResourceNotFoundException;
import auto_todo_tracker.model.dto.PatchTaskDTO;
import auto_todo_tracker.model.dto.PostTaskDTO;
import auto_todo_tracker.model.dto.TaskDTO;
import auto_todo_tracker.model.entity.SessionEntity;
import auto_todo_tracker.model.entity.TaskEntity;
import auto_todo_tracker.model.entity.TaskStatus;
import auto_todo_tracker.model.entity.TaskWithSession;
import auto_todo_tracker.repository.SessionRepository;
import auto_todo_tracker.repository.TaskRepository;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final SessionRepository sessionRepository;

    //コンストラクタ
    public TaskService(TaskRepository taskRepository,SessionRepository sessionRepository){
        this.taskRepository = taskRepository;
        this.sessionRepository = sessionRepository;
    }


    //タスク全取得処理
    public List<TaskDTO> getAllTaskDTOs(){

        //各EntityListを取得する
        List<TaskEntity> taskList = taskRepository.findAll();
        List<SessionEntity> sessionList = sessionRepository.findAll();

        //sessionIDと内容を紐づけたmapの作成
        Map<Long,TaskEntity> taskMap = new HashMap<>();
        for(TaskEntity task : taskList){
            System.out.println(task.getTaskStatus());
            taskMap.put(task.getTaskId(),task);
        }

        //Entity ⇒　DTOへ変換し返す
        return sessionList.stream()
                .map(session -> TaskDTO.toDTO(taskMap.get(session.getTask().getTaskId()),session))
                .toList();
    }


    //新規タスクの追加
    public TaskDTO createTaskDTO(PostTaskDTO postTaskDTO){

        //DTO ⇒ Entityに変換し保存
        TaskEntity taskEntity = postTaskDTO.toTaskEntity();
        SessionEntity sessionEntity = postTaskDTO.toSessionEntity();

        //リレーション
        taskEntity.setSession(sessionEntity);
        sessionEntity.setTask(taskEntity);

        //保存
        TaskEntity newTaskEntity = taskRepository.save(taskEntity);
        SessionEntity newSessionEntity = sessionRepository.save(sessionEntity);

        System.out.println(TaskDTO.toDTO(newTaskEntity,newSessionEntity));

        //TaskDTOとして返す
        return TaskDTO.toDTO(newTaskEntity,newSessionEntity);
    }

    
    //指定タスクの削除
    public void deleteTaskById(Long taskId) {

        //指定したIDに一致するタスクがあるか
        TaskEntity task = taskRepository.findById(taskId)
                        .orElseThrow(() -> new ResourceNotFoundException("指定されたタスクが見つかりません"));

        taskRepository.deleteById(taskId);

//        //タスクに作業時間などの記録があるか
//        SessionEntity session = sessionRepository.findById(task.getTaskId())
//                        .orElseThrow(() -> new EntityNotFoundException("セッションが見つかりません"));
//
//        sessionRepository.deleteById(session.getSessionId());
    }


    //指定タスクの更新
    public TaskDTO patchTaskById(Long taskId,PatchTaskDTO patchTaskDTO) {

        //バリデーション実施し、更新データを各Entityにまとめる。
        TaskWithSession tws = validDataPatchRequest(taskId, patchTaskDTO);
        return TaskDTO.toDTO(tws.getTaskEntity(),tws.getSessionEntity());

    }


    //PATCHリクエストに対するバリデーション処理
    public TaskWithSession validDataPatchRequest(Long taskId,PatchTaskDTO patchTaskDTO){

        final long MAX_ELAPSED_MS = 360_000_000L;

        //指定したIDに一致するタスクがあるか
        TaskEntity taskEntity = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("指定されたタスクが見つかりません"));

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
                    taskRepository.existsByTaskStatusAndTaskIdNot(TaskStatus.RUNNING,taskId)){
                throw  new ConflictException("作業中タスクがほかに存在します");
            }
            taskEntity.setTaskStatus(patchTaskDTO.taskStatus());
        }


        //計測
        if(patchTaskDTO.elapsedTime() != 0) {
            if (patchTaskDTO.elapsedTime() < 0) {
                throw new BadRequestException("※計測時間[ms]はマイナスになりません");
            }

            if (patchTaskDTO.elapsedTime() > MAX_ELAPSED_MS ) {     //360,000,000ms = 99h 59m 59s
                throw new BadRequestException("※計測できる時間の限界に達しました");
            }

            sessionEntity.setElapsedTime(patchTaskDTO.elapsedTime());
        }

        //保存
        TaskEntity newTaskEntity = taskRepository.save(taskEntity);
        SessionEntity newSessionEntity = sessionRepository.save(sessionEntity);

        return new TaskWithSession(newTaskEntity,newSessionEntity);
    }
}
