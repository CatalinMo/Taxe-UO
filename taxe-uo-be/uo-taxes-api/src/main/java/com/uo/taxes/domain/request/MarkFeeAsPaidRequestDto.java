package com.uo.taxes.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarkFeeAsPaidRequestDto {

    private Long accountId;
    private Long activeFeeId;
    private AccountRequestDto accountRequest;
}
