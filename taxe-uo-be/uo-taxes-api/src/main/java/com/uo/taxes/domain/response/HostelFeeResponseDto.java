package com.uo.taxes.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HostelFeeResponseDto {

    private Long id;
    private String hostelName;
    private String name;
    private Float value;
    private boolean budget;
    private String type;
}
