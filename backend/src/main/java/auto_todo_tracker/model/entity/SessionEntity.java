package auto_todo_tracker.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class SessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long sessionId;

    @OneToOne
    @JoinColumn(name = "task_id", nullable = false, unique = true) //作業時間などは更新して管理する仕様のため、1対1でunique制約
    private TaskEntity task;

    private String createdAt = "";
    private Integer elapsedTime = 0;
}
