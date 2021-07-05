package com.uo.taxes.exception;

public class BadUserException extends RuntimeException {
    public BadUserException(String message) {
        super(message);
    }
}
