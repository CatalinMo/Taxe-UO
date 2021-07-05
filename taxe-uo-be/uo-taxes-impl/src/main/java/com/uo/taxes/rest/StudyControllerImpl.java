package com.uo.taxes.rest;

import com.uo.taxes.application.StudyServiceApi;
import com.uo.taxes.domain.request.StudyRequestDto;
import com.uo.taxes.domain.response.StudyResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class StudyControllerImpl implements StudyControllerApi {

    private final StudyServiceApi studyService;

    @Override
    public void createStudy(StudyRequestDto request) {
        studyService.createStudy(request);
    }

    @Override
    public void updateStudy(Long id, StudyRequestDto request) {
        studyService.updateStudy(id, request);
    }

    @Override
    public void deleteStudy(Long id) {
        studyService.deleteStudy(id);
    }

    @Override
    public void deleteActiveStudy(Long id) {
        studyService.deleteActiveStudy(id);
    }

    @Override
    public List<StudyResponseDto> getStudies() {
        return studyService.getStudies();
    }
}
