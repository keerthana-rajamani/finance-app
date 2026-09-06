package com.examly.springapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BudgetValidationException extends RuntimeException {
    public BudgetValidationException(String message) {
        super(message);
    }
}
