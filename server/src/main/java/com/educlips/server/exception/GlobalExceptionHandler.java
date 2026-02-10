package com.educlips.server.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(UserNotFoundException.class)
        public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
        public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentialsException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }

    @ExceptionHandler(EmailAlreadyExistsException.class)
        public ResponseEntity<Map<String, String>> handleEmailExists(EmailAlreadyExistsException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.CONFLICT);
        }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
        public Map<String, String> handleDuplicateEmail(DataIntegrityViolationException ex) {
            return Map.of(
                "error", "Email already exists"
            );
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<Map<String, String>> handleAnyException(Exception ex) {
            ex.printStackTrace(); // IMPORTANT
            return ResponseEntity.status(500).body(
                Map.of("error", ex.getClass().getName(), "message", ex.getMessage())
            );
        }
        
}
