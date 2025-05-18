package auto_todo_tracker.repository;

import auto_todo_tracker.model.dto.TaskDTO;
import auto_todo_tracker.model.entity.TaskEntity;
import auto_todo_tracker.model.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity,Long> {
    //基本的なCRUD操作は未記載でOK

    //引数を条件として、ID以外で一致するレコードが存在するかを返す
    boolean existsByTaskStatusAndTaskIdNot(TaskStatus taskStatus, Long taskId);
}
