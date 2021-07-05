package com.uo.taxes.security.domain.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDto {

    private String firstName;
    private String lastName;
    private String email;
    private String cnp;
    private String role;
}
