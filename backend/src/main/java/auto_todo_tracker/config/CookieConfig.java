package auto_todo_tracker.config;

import org.springframework.boot.web.servlet.server.CookieSameSiteSupplier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CookieConfig {

    /* CookieのSameSite属性をNoneに設定。
    ※LaxではPOSTリクエストにJSESSIONIDが付与されず、403が返送されるため追加。*/
    @Bean
    public CookieSameSiteSupplier cookieSameSiteSupplier(){
        return CookieSameSiteSupplier.ofNone().whenHasName("JSESSIONID");
    }

}
