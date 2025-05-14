package auto_todo_tracker.model.entity;

import auto_todo_tracker.model.dto.TaskDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TaskEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long taskId;

    private String taskTitle;
    private String taskDescription = "";
    private String taskStatus = "TODO";

    @OneToOne(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private SessionEntity session;
}
