package com.uo.taxes.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AssignFeeToAccountRequestDto {

    private List<Long> ids;
    private ActiveFeeRequestDto activeFee;
}
