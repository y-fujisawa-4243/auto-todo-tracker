package auto_todo_tracker.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class UsersEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long usersId;

    @Column(unique = true,nullable = false,length = 20)
    @Size(min=4,max=20)
    private String userId;

    @Column(nullable = false,length = 256)
    @Size(min=8,max=256)
    private String password;

    //1つのUsersEntityに対して複数のTasksEntityの存在を定義。
    @OneToMany(mappedBy = "users",cascade = CascadeType.ALL,orphanRemoval = true )
    private List<TaskEntity> tasks;
}
