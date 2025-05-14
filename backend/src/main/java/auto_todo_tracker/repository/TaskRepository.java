package auto_todo_tracker.repository;

import auto_todo_tracker.model.dto.TaskDTO;
import auto_todo_tracker.model.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity,Long> {
    //基本的なCRUD操作のみ
}
