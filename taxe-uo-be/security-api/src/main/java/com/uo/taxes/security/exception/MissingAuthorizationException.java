package com.uo.taxes.security.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.UNAUTHORIZED, reason = "Unauthorized")
public class MissingAuthorizationException extends RuntimeException {

    public MissingAuthorizationException(String message) {
        super(message);
    }
}
