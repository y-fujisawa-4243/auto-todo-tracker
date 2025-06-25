package auto_todo_tracker.repository;

import auto_todo_tracker.model.entity.SessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SessionRepository extends JpaRepository <SessionEntity,Long> {
    //基本的なCRUD操作は未記載でOK

}
