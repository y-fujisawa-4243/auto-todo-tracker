package auto_todo_tracker.service;

import auto_todo_tracker.repository.UsersRepository;
import auto_todo_tracker.security.CustomUserDetails;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsersRepository usersRepository;

    public CustomUserDetailsService(UsersRepository usersRepository){
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        return usersRepository.findByUserId(userId)
                .map( u-> new CustomUserDetails(u))
                .orElseThrow( ()-> new UsernameNotFoundException("ユーザーIDが見つかりません"));
    }
}
