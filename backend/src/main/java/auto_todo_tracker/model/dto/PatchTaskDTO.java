package auto_todo_tracker.model.dto;

import auto_todo_tracker.model.entity.TaskStatus;

//PATCH要求受け取り用DTO
public record PatchTaskDTO(
        long taskId,
        String taskTitle,
        String taskDescription,
        String createdAt,
        TaskStatus taskStatus,
        int elapsedTime
) {

}
