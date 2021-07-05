package com.uo.taxes.application;

import com.uo.taxes.domain.request.StudyRequestDto;
import com.uo.taxes.domain.response.StudyResponseDto;

import java.util.List;

public interface StudyServiceApi {

    void createStudy(StudyRequestDto request);

    void updateStudy(Long id, StudyRequestDto request);

    void deleteStudy(Long id);

    void deleteActiveStudy(Long id);

    List<StudyResponseDto> getStudies();
}
