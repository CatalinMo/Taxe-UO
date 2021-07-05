package com.uo.taxes.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserIdentityResponseDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String cnp;
    private String password;
    private String role;
}
