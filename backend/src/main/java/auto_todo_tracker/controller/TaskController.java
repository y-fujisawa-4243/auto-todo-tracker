package auto_todo_tracker.controller;

import auto_todo_tracker.model.dto.PatchTaskDTO;
import auto_todo_tracker.model.dto.PostTaskDTO;
import auto_todo_tracker.model.dto.TaskDTO;
import auto_todo_tracker.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;

@RestController
public class TaskController {

    private final TaskService taskService;

    //コンストラクタの明示(@RequiredArgsConstructor不使用)
    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }


    //GETの窓口
    @GetMapping("/tasks")
    public List<TaskDTO> getAllTasks(){
        System.out.println("取得");
        return taskService.getAllTaskDTOs();
    }


    //POSTの窓口
    @PostMapping("/tasks")
    public TaskDTO createTask(@Valid  @RequestBody PostTaskDTO postTaskDTO){
        System.out.println("作成");
        return taskService.createTaskDTO(postTaskDTO);
    }


    //DELETEの窓口
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable("id") Long taskId) throws AccessDeniedException {
        System.out.println("削除"+taskId);
        taskService.deleteTaskById(taskId);
    }


    //PATCHの窓口
    @PatchMapping("/{id}")
    public TaskDTO patchTask(@PathVariable("id") Long taskId,
                             @Valid @RequestBody PatchTaskDTO patchTaskDTO) throws AccessDeniedException {
        System.out.println("更新/////"+ patchTaskDTO.taskStatus());
        System.out.println(taskService.patchTaskById(taskId,patchTaskDTO));
        return taskService.patchTaskById(taskId,patchTaskDTO);
    }

//-デバッグ用-------------------------------------------------------------------------------
    @PostMapping("/tasks/test")
    public void generateTestTasks(@RequestParam(defaultValue = "50") int count) {
        for (int i = 1; i <= count; i++) {
            PostTaskDTO task = new PostTaskDTO(
                    "テストタスク " + i,
                    "これはテストデータです",
                    LocalDate.now());

            createTask(task);
        }
    }

    @DeleteMapping("/tasksAll")
    public void allDeleteTask(){
        System.out.println("all delete");
        taskService.deleteTask();
    }


    @GetMapping("/500")
    public void triggerInternalServerError() {
        throw new RuntimeException("強制的に500エラーを発生させました");
    }


}
