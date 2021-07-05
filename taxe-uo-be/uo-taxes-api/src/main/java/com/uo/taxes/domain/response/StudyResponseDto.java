package com.uo.taxes.domain.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class StudyResponseDto {

    private Long id;
    private String faculty;
    private String cycle;
    private String department;
    private String studyProgram;
    private String form;
    private List<StudyFeeResponseDto> studyFees;
    private Integer year;
    private String abbreviation;
}
