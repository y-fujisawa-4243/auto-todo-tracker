package auto_todo_tracker.controller;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import auto_todo_tracker.model.dto.PatchTaskDTO;
import auto_todo_tracker.model.dto.PostTaskDTO;
import auto_todo_tracker.model.dto.TaskDTO;
import auto_todo_tracker.service.TaskService;

import java.nio.file.AccessDeniedException;
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
        return taskService.getAllTaskDTOs();
    }


    //POSTの窓口
    @PostMapping("/tasks")
    public TaskDTO createTask(@Valid @RequestBody PostTaskDTO postTaskDTO){
        return taskService.createTaskDTO(postTaskDTO);
    }


    //DELETEの窓口
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable("id") Long taskId) throws AccessDeniedException {
        taskService.deleteTaskById(taskId);
    }


    //PATCHの窓口
    @PatchMapping("/{id}")
    public TaskDTO patchTask(@PathVariable("id") Long taskId,
                             @Valid @RequestBody PatchTaskDTO patchTaskDTO) throws AccessDeniedException {
        return taskService.patchTaskById(taskId,patchTaskDTO);
    }

}
