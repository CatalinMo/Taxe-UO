package com.uo.taxes.domain.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StudyRequestDto {

    private String faculty;
    private String cycle;
    private String department;
    private String studyProgram;
    private String form;
    private List<StudyFeeRequestDto> studyFees;
    private Integer year;
    private String abbreviation;
}
