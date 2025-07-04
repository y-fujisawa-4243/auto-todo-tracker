package auto_todo_tracker.util;

import auto_todo_tracker.model.entity.UsersEntity;
import auto_todo_tracker.repository.UsersRepository;
import auto_todo_tracker.security.CustomUserDetails;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    private final UsersRepository usersRepository;

    public SecurityUtil(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }


    //現在のユーザー情報を取得する
    public UsersEntity getCurrentUser(){

        //ユーザー情報取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        String userName = principal.getUsername();

        return usersRepository.findByUserId(userName)
                .orElseThrow( ()->new RuntimeException("ユーザーが見つかりません"));
    }


    //ユーザーが認証済みかどうか返す
    public static boolean isAuthenticated(){

        //ユーザー情報取得
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        /*
        認証済みかの判定。
        備考：
        ログインユーザーアクセス時も匿名ユーザー用トークを保持する場合があり、その際の型が"AnonymousAuthenticationToken"
        すなわち、authenticationの型が匿名ユーザーであれば、false
        * */
        return authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);

    }

}
