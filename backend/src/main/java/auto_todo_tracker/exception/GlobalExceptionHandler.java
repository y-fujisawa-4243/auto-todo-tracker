package auto_todo_tracker.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import auto_todo_tracker.model.dto.ErrorResDTO;

import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //400 Bad Request(@Valid起因)のエラーハンドリング
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResDTO> handleValidationError (MethodArgumentNotValidException err){
        String errMsg = err.getBindingResult().getFieldError().getDefaultMessage();
        ErrorResDTO errorResDTO = new ErrorResDTO("VALIDATION_ERROR",errMsg);
        return new ResponseEntity<>(errorResDTO,HttpStatus.BAD_REQUEST);
    }

    //400 Bad Requestのエラーハンドリング
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResDTO> handleValidationError (BadRequestException err){
        ErrorResDTO errorResDTO = new ErrorResDTO("BAD_REQUEST",err.getMessage());
        return new ResponseEntity<>(errorResDTO, HttpStatus.BAD_REQUEST);
    }


    //401 認証失敗のエラーハンドリング
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResDTO> handleAuthError(AuthenticationException err){
        ErrorResDTO errorResDTO = new ErrorResDTO("UNAUTHORIZED", err.getMessage());
        return new ResponseEntity<>(errorResDTO,HttpStatus.UNAUTHORIZED);
    }

    //403 認可違反のエラーハンドリング
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResDTO> handleAccessDeniedError(AccessDeniedException err){
        ErrorResDTO errorResDTO = new ErrorResDTO("DENIED",err.getMessage());
        return new ResponseEntity<>(errorResDTO,HttpStatus.FORBIDDEN);
    }

    //404 Not Foundのエラーハンドリング (ResourceNotFoundExceptionは自作例外クラス)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResDTO> handleNotFound (ResourceNotFoundException err){
        ErrorResDTO errorResDTO = new ErrorResDTO("NOT_FOUND",err.getMessage());
        return new ResponseEntity<>(errorResDTO, HttpStatus.NOT_FOUND);
    }


    //409 Conflict(ステータス重複起因)のエラーハンドリング (ConflictExceptionは自作例外クラス)
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResDTO> handleConflict (ConflictException err){
        ErrorResDTO errorResDTO = new ErrorResDTO("CONFLICT", err.getMessage());
        return new ResponseEntity<>(errorResDTO,HttpStatus.CONFLICT);
    }


    //409 Conflict(タスク数超過)のエラーハンドリング (ConflictExceptionは自作例外クラス)
    @ExceptionHandler(TaskLimitException.class)
    public ResponseEntity<ErrorResDTO> handleTaskLimit (TaskLimitException err){
        ErrorResDTO errorResDTO = new ErrorResDTO("TASK_LIMIT", err.getMessage());
        return new ResponseEntity<>(errorResDTO,HttpStatus.CONFLICT);
    }


    //409 Conflict(ユーザーID使用済み)のエラーハンドリング(DuplicateUserIdExceptionは自作例外クラス)
    @ExceptionHandler(DuplicateUserIdException.class)
    public ResponseEntity<ErrorResDTO> handleDuplicateUserId(DuplicateUserIdException err){
        ErrorResDTO errorResDTO = new ErrorResDTO("DUPLICATE",err.getMessage());
        return new ResponseEntity<>(errorResDTO,HttpStatus.CONFLICT);
    }

    //500 汎用的なエラーハンドリング
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResDTO> handleServerError (Exception err){
        ErrorResDTO errorResDTO = new ErrorResDTO(
                "INTERNAL_SERVER_ERROR",
                "サーバー内でエラーが発生しました。");
        return new ResponseEntity<>(errorResDTO,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
