package auto_todo_tracker.exception;

import auto_todo_tracker.model.dto.ErrorResDTO;
import org.hibernate.ResourceClosedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {


    //400 Bad Request(@Valid起因)のエラーハンドリング
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResDTO> handleValidationError (MethodArgumentNotValidException err){
        System.out.println("400");
        String errMsg = err.getBindingResult().getFieldError().getDefaultMessage();
        ErrorResDTO errorResDTO = new ErrorResDTO("VALIDATION_ERROR",errMsg);
        return new ResponseEntity<>(errorResDTO,HttpStatus.BAD_REQUEST);
    }

    //400 Bad Requestのエラーハンドリング
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResDTO> handleValidationError (BadRequestException err){
        System.out.println("400");
        ErrorResDTO errorResDTO = new ErrorResDTO("Bad Request",err.getMessage());
        return new ResponseEntity<>(errorResDTO, HttpStatus.BAD_REQUEST);
    }


    //404 Not Foundのエラーハンドリング (ResourceNotFoundExceptionは自作例外クラス)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResDTO> handleNotFound (ResourceNotFoundException err){
        System.out.println("404");
        ErrorResDTO errorResDTO = new ErrorResDTO("Not Found",err.getMessage());
        return new ResponseEntity<>(errorResDTO, HttpStatus.NOT_FOUND);
    }


    //409 Conflict(ステータス重複起因)のエラーハンドリング (ConflictExceptionは自作例外クラス)
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResDTO> handleConflict (ConflictException err){
        System.out.println("409");
        ErrorResDTO errorResDTO = new ErrorResDTO("CONFLICT", err.getMessage());
        return new ResponseEntity<>(errorResDTO,HttpStatus.CONFLICT);
    }


    //409 Conflict(タスク数超過)のエラーハンドリング (ConflictExceptionは自作例外クラス)
    @ExceptionHandler(TaskLimitException.class)
    public ResponseEntity<ErrorResDTO> handleTaskLimit (TaskLimitException err){
        System.out.println("409");
        ErrorResDTO errorResDTO = new ErrorResDTO("TASK_LIMIT", err.getMessage());
        return new ResponseEntity<>(errorResDTO,HttpStatus.CONFLICT);
    }


    //500 汎用的なエラーハンドリング
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResDTO> handleServerError (Exception err){
        System.out.println("500");
        ErrorResDTO errorResDTO = new ErrorResDTO(
                "INTERNAL_SERVER_ERROR",
                "サーバー内でエラーが発生しました。");
        return new ResponseEntity<>(errorResDTO,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
