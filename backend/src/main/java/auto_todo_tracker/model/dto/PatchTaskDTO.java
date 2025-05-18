package auto_todo_tracker.model.dto;

import auto_todo_tracker.model.entity.SessionEntity;
import auto_todo_tracker.model.entity.TaskEntity;
import auto_todo_tracker.model.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

//PATCH要求受け取り用DTO
public record PatchTaskDTO(
        long taskId,
        String taskTitle,
        String taskDescription,
        String createdAt,
        TaskStatus taskStatus,
        int elapsedTime
) {

//    //DTO　⇒　Entityへの変換メソッド
//    public TaskEntity toTaskEntity(){
//        TaskEntity taskEntity = new TaskEntity();
//
//        if (this.taskTitle != null) taskEntity.setTaskTitle(this.taskTitle);
//        if (this.taskDescription != null) taskEntity.setTaskDescription(this.taskDescription);
//        if (this.taskStatus != null) taskEntity.setTaskStatus(this.taskStatus);
//
//        return taskEntity;
//    }
//
//
//    //DTO　⇒　Entityへの変換メソッド
//    public SessionEntity toSessionEntity(){
//        SessionEntity sessionEntity = new SessionEntity();
//
//        if(this.createdAt != null) sessionEntity.setCreatedAt(createdAt);
//        if(this.elapsedTime != 0) sessionEntity.setElapsedTime(elapsedTime);
//
//        return sessionEntity;
//    }

}
