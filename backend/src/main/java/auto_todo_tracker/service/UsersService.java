package auto_todo_tracker.service;

import auto_todo_tracker.exception.DuplicateUserIdException;
import auto_todo_tracker.model.dto.PostUsersDTO;
import auto_todo_tracker.model.entity.UsersEntity;
import auto_todo_tracker.repository.UsersRepository;
import auto_todo_tracker.util.SecurityUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    public UsersService(UsersRepository usersRepository ,BCryptPasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }


    //新規アカウント作成処理
    public void createAccount(PostUsersDTO postUsersDTO) {

        //重複確認
        if (usersRepository.existsByUserId(postUsersDTO.userId())){
            throw new DuplicateUserIdException("そのユーザーIDはすでに使用されています");
        }

        //エンコード処理
        String hashPassword = passwordEncoder.encode(postUsersDTO.password());

        //Entity化し保存
        UsersEntity usersEntity = postUsersDTO.toUsersEntity(postUsersDTO.userId(), hashPassword);
        usersRepository.save(usersEntity);

    }


    //認証済みかの確認
    public boolean checkAuth(){
        return SecurityUtil.isAuthenticated();
    }
}
