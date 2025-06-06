package auto_todo_tracker.repository;

import auto_todo_tracker.model.entity.TaskStatus;
import auto_todo_tracker.model.entity.UsersEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<UsersEntity,Long> {

    //引数に指定したユーザーIDがDB内に存在するかを返す。
    boolean existsByUserId(String userId);

    //引数に指定したユーザーIDがあれば、そのUsersEntityを返す。
    Optional<UsersEntity> findByUserId(String userId);

    //usersIdからエンティティ取得
    UsersEntity findByUsersId(Long usersId);
}
