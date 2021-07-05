package com.uo.taxes.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class PaidFeeRequestDto {

    private String name;
    private String details;
    private String comment;
    private Timestamp dateOfPayment;
    private Float value;
}
