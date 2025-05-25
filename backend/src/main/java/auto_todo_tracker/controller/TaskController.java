package auto_todo_tracker.controller;

import auto_todo_tracker.model.dto.PatchTaskDTO;
import auto_todo_tracker.model.dto.PostTaskDTO;
import auto_todo_tracker.model.dto.TaskDTO;
import auto_todo_tracker.model.entity.SessionEntity;
import auto_todo_tracker.model.entity.TaskEntity;
import auto_todo_tracker.model.entity.TaskStatus;
import auto_todo_tracker.repository.SessionRepository;
import auto_todo_tracker.repository.TaskRepository;
import auto_todo_tracker.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
public class TaskController {

    private final TaskService taskService;

    //コンストラクタの明示(@RequiredArgsConstructor不使用)
    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }


    //GETの窓口
    @GetMapping("/")
    public List<TaskDTO> getAllTasks(){
        System.out.println("取得");
        return taskService.getAllTaskDTOs();
    }


    //POSTの窓口
    @PostMapping("/")
    public TaskDTO createTask(@Valid  @RequestBody PostTaskDTO postTaskDTO){
        System.out.println("作成");
        return taskService.createTaskDTO(postTaskDTO);
    }


    //DELETEの窓口
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable("id") Long taskId){
        System.out.println("削除"+taskId);
        taskService.deleteTaskById(taskId);
    }


    //PATCHの窓口
    @PatchMapping("/{id}")
    public TaskDTO patchTask(@PathVariable("id") Long taskId,
                             @Valid @RequestBody PatchTaskDTO patchTaskDTO){
        System.out.println("更新/////"+ patchTaskDTO.taskStatus());
        System.out.println(taskService.patchTaskById(taskId,patchTaskDTO));
        return taskService.patchTaskById(taskId,patchTaskDTO);
    }

//--------------------------------------------------------------------------------
    @PostMapping("/list/test")
    public void generateTestTasks(@RequestParam(defaultValue = "50") int count) {
        for (int i = 1; i <= count; i++) {
            PostTaskDTO task = new PostTaskDTO(
                    "テストタスク " + i,
                    "これはテストデータです",
                    LocalDate.now());

            createTask(task);
        }
    }

    @DeleteMapping("/list/all")
    public void allDeleteTask(){
        System.out.println("all delete");
        taskService.deleteTask();
    }


    @GetMapping("/500")
    public void triggerInternalServerError() {
        throw new RuntimeException("強制的に500エラーを発生させました");
    }


}
