package com.uo.taxes.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class PaidFeeResponseDto {

    private Long id;
    private String name;
    private String details;
    private String comment;
    private Timestamp dateOfPayment;
    private Float value;
}
