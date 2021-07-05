package com.uo.taxes.domain.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActiveStudyResponseDto {

    private Long id;
    private String faculty;
    private String cycle;
    private String department;
    private String studyProgram;
    private String form;
    private Integer year;
    private String abbreviation;
    private boolean budget;
    private String accommodated;
}
