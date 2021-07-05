package com.uo.taxes.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class ActiveFeeRequestDto {

    private String name;
    private String details;
    private String comment;
    private Timestamp limitDate;
    private Float value;
}
