package com.uo.taxes.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AccountRequestDto {

    private String firstName;
    private String lastName;
    private String cnp;
    private String email;
    private String phone;
    private List<ActiveStudyRequestDto> activeStudies;
    private List<ActiveFeeRequestDto> activeFees;
    private List<PaidFeeRequestDto> paidFees;
}
