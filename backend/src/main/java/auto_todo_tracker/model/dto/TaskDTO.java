package auto_todo_tracker.model.dto;

import auto_todo_tracker.model.entity.SessionEntity;
import auto_todo_tracker.model.entity.TaskEntity;
import jakarta.persistence.Entity;

//フロント返送用DTO
public record TaskDTO (
        long taskId,
        String taskTitle,
        String taskDescription,
        String taskStatus,
        String createdAt,
        int elapsedTime
) {

    //Entity　⇒　DTOへの変換メソッド
    public static TaskDTO toDTO(TaskEntity taskEntity, SessionEntity sessionEntity){
        System.out.println(taskEntity.getTaskTitle());
        System.out.println(taskEntity.getTaskStatus());
        System.out.println(sessionEntity.getElapsedTime());

        return new TaskDTO(
                taskEntity.getTaskId(),
                taskEntity.getTaskTitle(),
                taskEntity.getTaskDescription(),
                taskEntity.getTaskStatus(),
                sessionEntity.getCreatedAt(),
                sessionEntity.getElapsedTime()
        );
    }

}
