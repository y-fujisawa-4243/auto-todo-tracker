package auto_todo_tracker.service;

import auto_todo_tracker.model.dto.PatchTaskDTO;
import auto_todo_tracker.model.dto.PostTaskDTO;
import auto_todo_tracker.model.dto.TaskDTO;
import auto_todo_tracker.model.entity.SessionEntity;
import auto_todo_tracker.model.entity.TaskEntity;
import auto_todo_tracker.repository.SessionRepository;
import auto_todo_tracker.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.hibernate.Session;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
                        .orElseThrow(() -> new EntityNotFoundException("タスクが見つかりません"));

        taskRepository.deleteById(taskId);

//        //タスクに作業時間などの記録があるか
//        SessionEntity session = sessionRepository.findById(task.getTaskId())
//                        .orElseThrow(() -> new EntityNotFoundException("セッションが見つかりません"));
//
//        sessionRepository.deleteById(session.getSessionId());
    }


    //指定タスクの更新
    public TaskDTO patchTaskById(Long taskId,PatchTaskDTO patchTaskDTO) {

        //指定したIDに一致するタスクがあるか
        TaskEntity taskEntity = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("タスクが見つかりません"));

        SessionEntity sessionEntity = taskEntity.getSession();

        //更新データがあるフィールドのみ更新
        if (patchTaskDTO.taskTitle() != null) taskEntity.setTaskTitle(patchTaskDTO.taskTitle());
        if (patchTaskDTO.taskDescription() != null) taskEntity.setTaskDescription(patchTaskDTO.taskDescription());
        if (patchTaskDTO.taskStatus() != null) taskEntity.setTaskStatus(patchTaskDTO.taskStatus());

        if(patchTaskDTO.createdAt() != null) sessionEntity.setCreatedAt(patchTaskDTO.createdAt());
        if(patchTaskDTO.elapsedTime() != 0) sessionEntity.setElapsedTime(patchTaskDTO.elapsedTime());

        //保存
        TaskEntity newTaskEntity = taskRepository.save(taskEntity);
        SessionEntity newSessionEntity = sessionRepository.save(sessionEntity);

        return TaskDTO.toDTO(newTaskEntity,newSessionEntity);

    }
}
