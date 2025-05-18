package auto_todo_tracker.model.dto;

import auto_todo_tracker.model.entity.SessionEntity;
import auto_todo_tracker.model.entity.TaskEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.Session;

import java.time.LocalDate;

//POST要求受け取り用DTO
public record PostTaskDTO(
        @NotBlank(message = "※タイトルは必須です")
        @Size(max=20,message = "※タイトルは20文字以内で入力してください")
        String taskTitle,

        @Size(max=256,message = "※説明は256文字以内で入力してください")
        String taskDescription,

        @NotNull
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate createdAt
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
