package auto_todo_tracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    //エンコーダー
    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


    //Spring Security設定
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                //csrf設定(開発時：disable)
                .csrf(csrf -> csrf.disable())
                //cors有効化
                .cors(cors -> {})
                //ページアクセス権限の設定
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/signup","/signin","signout","/auth/check"
                                ,"/check","/userAll","/tasksAll").permitAll()
                        .anyRequest().authenticated()
                )
                //セッション管理(必要時生成)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                //SecurityContextの自動保存設定(false=オン,True=オフ)
                .securityContext(securityContext -> securityContext
                        .securityContextRepository(new HttpSessionSecurityContextRepository())
                        .requireExplicitSave(false)
                )
                //自動ログイン無効化
                .formLogin(form -> form.disable())
                //Basic認証の無効化
                .httpBasic(httpBasic -> httpBasic.disable())
                .build();
    }

    //認証処理用のAuthenticationManagerの手動設定
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
