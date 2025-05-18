package auto_todo_tracker.model.dto;

//エラー情報
public record ErrorResDTO(
    String errorCode,
    String errorMsg
) {
}
