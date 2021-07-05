package com.uo.taxes.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtherFeeResponseDto {

    private Long id;
    private String name;
    private Float value;
    private String type;
}
