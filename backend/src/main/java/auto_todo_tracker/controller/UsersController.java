package auto_todo_tracker.controller;

import auto_todo_tracker.model.dto.ErrorResDTO;
import auto_todo_tracker.model.dto.PostUsersDTO;
import auto_todo_tracker.model.dto.TaskDTO;
import auto_todo_tracker.repository.UsersRepository;
import auto_todo_tracker.service.CustomUserDetailsService;
import auto_todo_tracker.service.UsersService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;


@RestController
public class UsersController {

    private final UsersService usersService;
    private final AuthenticationManager authenticationManager;

    private final UsersRepository usersRepository;

    //コンストラクタの明示
    public UsersController(UsersService usersService, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, CustomUserDetailsService customUserDetailsService, UsersRepository usersRepository){
        this.usersService = usersService;
        this.authenticationManager = authenticationManager;
        this.usersRepository = usersRepository;
    }


    //新規登録
    @PostMapping("/signup")
    public ResponseEntity<?> createAccount(@RequestBody @Valid PostUsersDTO postUsersDTO){
        System.out.println("サインアップ"+postUsersDTO.userId()+"///"+postUsersDTO.password());
        usersService.createAccount(postUsersDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    //サインイン
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody @Valid PostUsersDTO postUsersDTO,HttpServletRequest request){
        System.out.println("サインイン///"+postUsersDTO.userId()+"///"+postUsersDTO.password());
        try {

            //トークン作成
            UsernamePasswordAuthenticationToken token =
                    new UsernamePasswordAuthenticationToken(postUsersDTO.userId(),postUsersDTO.password());

            // 認証処理実行（DB照合、パスワード検証など）
            Authentication authentication = authenticationManager.authenticate(token);

            //認証処理実行
            /*
            DBからユーザー情報取得
            パスワードの比較
            */

            //認証結果の保持
            SecurityContextHolder.getContext().setAuthentication(authentication);

            return ResponseEntity.status(HttpStatus.ACCEPTED).build();

        } catch (AuthenticationException ex) {
            ErrorResDTO errorResDTO = new ErrorResDTO(
                    "UNAUTHORIZED",
                    "※サインインに失敗しました。ユーザーIDまたはパスワードに誤りがございます。");
            return new ResponseEntity<>(errorResDTO, HttpStatus.UNAUTHORIZED);
        }

    }


    //サインアウト
    @PostMapping("/signout")
    public ResponseEntity<?> signOut(HttpServletRequest request, HttpServletResponse response) {

        System.out.println("サインアウト");

        //セッション破棄
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        //認証結果の破棄
        SecurityContextHolder.clearContext();

        System.out.println("セッションID: " + (session != null ? session.getId() : "null"));

        return ResponseEntity.ok().body("サインアウトしました");
    }


    //認証済みかの確認処理
    @GetMapping("/auth/check")
    public ResponseEntity<?> checkAuth() throws AuthenticationException{
        System.out.println("認証チェック");
        if(usersService.checkAuth()){
            return ResponseEntity.ok().build();
        }else {
            throw new AuthenticationCredentialsNotFoundException("未認証状態です");
        }
    }

//    @GetMapping("/auth/check")
//    public ResponseEntity<?> checkAuth(Authentication authentication, HttpServletRequest request) {
//
//        HttpSession session = request.getSession(false);
//
//        System.out.println("==== 認証チェック ====");
//        System.out.println("セッション: " + (session != null ? session.getId() : "なし"));
//        System.out.println("Authentication: " + authentication);
//        if (authentication != null) {
//            System.out.println("認証クラス: " + authentication.getClass().getName());
//            System.out.println("isAuthenticated: " + authentication.isAuthenticated());
//        }
//
//        return (authentication != null &&
//                authentication.isAuthenticated() &&
//                !(authentication instanceof AnonymousAuthenticationToken))
//                ? ResponseEntity.ok().build()
//                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//    }

    //---debug用-------------------------------------------------------------------------
    @PostMapping("/check")
    public void createTask(@RequestBody TaskDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("認証情報: " + auth);
        System.out.println("認証済み？: " + (auth != null && auth.isAuthenticated()));
        return;
    }

    @DeleteMapping("/userAll")
    public void deleteAllUser(){
        usersRepository.deleteAll();
    }


}
