package auto_todo_tracker.model.dto;

import auto_todo_tracker.model.entity.SessionEntity;
import auto_todo_tracker.model.entity.TaskEntity;
import org.hibernate.Session;

//POST要求受け取り用DTO
public record PostTaskDTO(
        String taskTitle,
        String taskDescription,
        String createdAt
) {

    //DTO　⇒　Entityへの変換メソッド
    public TaskEntity toTaskEntity(){
        TaskEntity taskEntity = new TaskEntity();
        taskEntity.setTaskTitle(this.taskTitle);
        taskEntity.setTaskDescription(this.taskDescription);

        return taskEntity;
    }

    //DTO　⇒　Entityへの変換メソッド
    public SessionEntity toSessionEntity(){
        SessionEntity sessionEntity = new SessionEntity();
        sessionEntity.setCreatedAt(this.createdAt);
        return sessionEntity;
    }
}
