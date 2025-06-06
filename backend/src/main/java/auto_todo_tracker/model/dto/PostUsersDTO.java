package auto_todo_tracker.model.dto;

import auto_todo_tracker.model.entity.UsersEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.UniqueElements;
import org.springframework.context.annotation.Primary;

public record PostUsersDTO(

        @NotBlank
        @Size(min=4,max=20,message = "※ユーザーIDは4～20文字で入力してください")
        @Pattern(regexp = "^[a-zA-Z0-9]+$",message = "※ユーザーID/パスワードは半角英数字のみ使用可能です")
        String userId,

        @NotBlank
        @Size(min=8,max=64,message = "※パスワードは8～64文字以内で入力してください")
        @Pattern(regexp = "^[a-zA-Z0-9]+$",message = "※ユーザーID/パスワードは半角英数字のみ使用可能です")
        String password
) {

        //DTO⇒Entityへの変換メソッド
        public UsersEntity toUsersEntity(String userId,String hashPassword){
                UsersEntity usersEntity = new UsersEntity();
                usersEntity.setUserId(userId);
                usersEntity.setPassword(hashPassword);
                return usersEntity;
        }

}
