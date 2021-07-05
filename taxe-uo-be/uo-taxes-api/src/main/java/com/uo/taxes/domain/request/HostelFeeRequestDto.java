package com.uo.taxes.domain.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HostelFeeRequestDto {

    private String hostelName;
    private String name;
    private Float value;
    private boolean budget;
    private String type;
}
