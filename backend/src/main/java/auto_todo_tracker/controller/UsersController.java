package auto_todo_tracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import auto_todo_tracker.model.dto.ErrorResDTO;
import auto_todo_tracker.model.dto.PostUsersDTO;
import auto_todo_tracker.repository.UsersRepository;
import auto_todo_tracker.service.UsersService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
public class UsersController {

    private final UsersService usersService;
    private final AuthenticationManager authenticationManager;

    private final UsersRepository usersRepository;

    //コンストラクタの明示
    public UsersController(UsersService usersService,
                           AuthenticationManager authenticationManager,
                           UsersRepository usersRepository){
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
    public ResponseEntity<?> signIn(@RequestBody @Valid PostUsersDTO postUsersDTO){

        try {

            //トークン作成
            UsernamePasswordAuthenticationToken token =
                    new UsernamePasswordAuthenticationToken(postUsersDTO.userId(),postUsersDTO.password());

            // 認証処理実行（DB照合、パスワード検証など）
            Authentication authentication = authenticationManager.authenticate(token);

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

        //セッション破棄
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        //認証結果の破棄
        SecurityContextHolder.clearContext();


        return ResponseEntity.ok().body("サインアウトしました");
    }


    //認証済みかの確認処理
    @GetMapping("/auth/check")
    public ResponseEntity<?> checkAuth(HttpServletRequest request) throws AuthenticationException{

        //送信時、SessionIDが存在するか、しない場合はnullを返送。
        HttpSession session = request.getSession(false);

        //SessionIDが存在しない時点で、未認証を返送。※sessionの自走生成を防ぐ意図。
        if(session == null){
            throw new AuthenticationCredentialsNotFoundException("未認証状態です");
        }

        if(usersService.checkAuth()){
            return ResponseEntity.ok().build();
        }else {
            throw new AuthenticationCredentialsNotFoundException("未認証状態です");
        }
    }

}
