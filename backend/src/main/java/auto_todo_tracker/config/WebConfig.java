package auto_todo_tracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3000", //開発用
                        "https://auto-todo-tracker.vercel.app/" //公開用
                )
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

}
