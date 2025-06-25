package auto_todo_tracker.repository;

import auto_todo_tracker.model.entity.TaskEntity;
import auto_todo_tracker.model.entity.TaskStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity,Long> {
    //基本的なCRUD操作は未記載でOK

    /*taskRepository内から
    usersIdが一致している かつ
    taskStatusが一致している かつ
    更新するタスクとは異なるタスク のタスクが存在するか*/
    boolean existsByUsers_UsersIdAndTaskStatusAndTaskIdNot(Long usersId, TaskStatus taskStatus, Long taskId);

    //ユーザーそれぞれのタスクと紐づくセッションを取得する
    @Query("SELECT task FROM TaskEntity task JOIN FETCH task.session WHERE task.users.usersId =:usersId")
    List<TaskEntity> findByUsers_UsersIdWithSession(@Param("usersId") Long usersId);

    //ユーザーが保持しているタスク数の取得
    long countByUsers_UsersId(Long usersId);

    //ユーザーがそのタスクを保持しているか
    boolean existsByUsers_UsersIdAndTaskId(Long usersId, Long taskId);
}
