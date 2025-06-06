package auto_todo_tracker.security;

import auto_todo_tracker.model.entity.UsersEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final UsersEntity usersEntity;

    public CustomUserDetails(UsersEntity usersEntity){
        this.usersEntity = usersEntity;
    }

    @Override
    public String getPassword(){return usersEntity.getPassword();}

    @Override
    public String getUsername(){return usersEntity.getUserId();}

    //---以下から不使用。今後を考慮して残しておく------------------------------

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){return List.of();}

    @Override
    public boolean isAccountNonExpired(){return true;}

    @Override
    public boolean isAccountNonLocked(){return true;}

    @Override
    public boolean isCredentialsNonExpired(){return true;}

    @Override
    public boolean  isEnabled(){return true;}

}
