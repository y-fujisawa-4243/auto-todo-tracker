package auto_todo_tracker.model.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskWithSession{
    private TaskEntity taskEntity;
    private SessionEntity sessionEntity;

    public TaskWithSession(){}

    public TaskWithSession(TaskEntity taskEntity,SessionEntity sessionEntity){
        this.taskEntity = taskEntity;
        this.sessionEntity = sessionEntity;
    }
}
