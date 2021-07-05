package com.uo.taxes.application;

import com.uo.taxes.domain.request.StudyFeeRequestDto;
import com.uo.taxes.domain.response.StudyFeeResponseDto;

import java.util.List;

public interface StudyFeeServiceApi {

    void updateStudy(Long id, StudyFeeRequestDto request);

    void deleteStudyFee(Long id);

    List<StudyFeeResponseDto> getStudyFees();
}
