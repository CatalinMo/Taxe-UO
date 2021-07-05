package com.uo.taxes.rest;

import com.uo.taxes.application.StudyFeeServiceApi;
import com.uo.taxes.domain.request.StudyFeeRequestDto;
import com.uo.taxes.domain.response.StudyFeeResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class StudyFeeControllerImpl implements StudyFeeControllerApi {

    private final StudyFeeServiceApi studyFeeService;

    @Override
    public void updateStudyFee(Long id, StudyFeeRequestDto request) {
        studyFeeService.updateStudy(id, request);
    }

    @Override
    public void deleteStudyFee(Long id) {
        studyFeeService.deleteStudyFee(id);
    }

    @Override
    public List<StudyFeeResponseDto> getStudyFees() {
        return studyFeeService.getStudyFees();
    }
}
