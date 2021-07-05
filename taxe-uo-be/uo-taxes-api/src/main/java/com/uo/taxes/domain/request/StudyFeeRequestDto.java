package com.uo.taxes.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudyFeeRequestDto {

    private String name;
    private Float value;
    private String type;
}
