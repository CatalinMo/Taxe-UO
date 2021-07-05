package com.uo.taxes.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AccountResponseDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String cnp;
    private String email;
    private String phone;
    private List<ActiveStudyResponseDto> activeStudies;
    private List<ActiveFeeResponseDto> activeFees;
    private List<PaidFeeResponseDto> paidFees;
}
