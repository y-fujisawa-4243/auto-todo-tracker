package auto_todo_tracker.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class TaskEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long taskId;

    @Column(length = 20,nullable = false)
    private String taskTitle;

    @Column(length = 256)
    private String taskDescription = "";

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private TaskStatus taskStatus = TaskStatus.TODO;

    @ManyToOne
    @JoinColumn(name = "usersId",nullable = false)
    private UsersEntity users;

    //1つのTaskEntityに対して1つのSessionEntityの存在を定義。
    @OneToOne(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private SessionEntity session;
}
