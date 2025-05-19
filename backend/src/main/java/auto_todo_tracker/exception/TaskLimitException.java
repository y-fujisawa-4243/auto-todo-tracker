package auto_todo_tracker.exception;

public class TaskLimitException extends RuntimeException {
    public TaskLimitException (String message) {
        super(message);
    }
}
