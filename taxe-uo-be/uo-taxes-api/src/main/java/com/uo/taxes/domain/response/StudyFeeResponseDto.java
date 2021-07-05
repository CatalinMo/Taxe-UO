package com.uo.taxes.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudyFeeResponseDto {

    private Long id;
    private String name;
    private Float value;
    private String type;
    private StudyResponseDto study;
}
