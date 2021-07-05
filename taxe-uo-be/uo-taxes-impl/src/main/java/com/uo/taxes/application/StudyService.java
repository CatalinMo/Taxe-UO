package com.uo.taxes.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uo.taxes.domain.StudyEntity;
import com.uo.taxes.domain.request.StudyRequestDto;
import com.uo.taxes.domain.response.StudyResponseDto;
import com.uo.taxes.infrastructure.ActiveStudyRepository;
import com.uo.taxes.infrastructure.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class StudyService implements StudyServiceApi {

    private final StudyRepository studyRepository;
    private final ActiveStudyRepository activeStudyRepository;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;

    @Override
    public void createStudy(StudyRequestDto request) {
        StudyEntity studyEntity = convert(request, StudyEntity.class);
        studyRepository.save(studyEntity);
    }

    @Override
    public void updateStudy(Long id, StudyRequestDto request) {
        StudyEntity studyEntity = studyRepository.findById(id).orElseThrow(NullPointerException::new);
        modelMapper.map(request, studyEntity);
        studyRepository.save(studyEntity);
    }

    @Override
    public void deleteStudy(Long id) {
        studyRepository.deleteById(id);
    }

    @Override
    public void deleteActiveStudy(Long id) {
        activeStudyRepository.deleteById(id);
    }

    @Override
    public List<StudyResponseDto> getStudies() {
        List<StudyEntity> studyEntities = studyRepository.findAll();
        return convertStudyToDto(studyEntities);
    }

    private  List<StudyResponseDto> convertStudyToDto(List<StudyEntity> studyEntities) {
        return studyEntities.stream()
                .map(this::convert)
                .collect(Collectors.toList());
    }

    private StudyResponseDto convert(StudyEntity studyEntity) {
        StudyResponseDto studyResponse = new StudyResponseDto();
        studyResponse.setId(studyEntity.getId());
        studyResponse.setFaculty(studyEntity.getFaculty());
        studyResponse.setCycle(studyEntity.getCycle());
        studyResponse.setDepartment(studyEntity.getDepartment());
        studyResponse.setStudyProgram(studyEntity.getStudyProgram());
        studyResponse.setForm(studyEntity.getForm());
        studyResponse.setStudyFees(new ArrayList(studyEntity.getStudyFees()));
        studyResponse.setYear(studyEntity.getYear());
        studyResponse.setAbbreviation(studyEntity.getAbbreviation());
        return studyResponse;
    }

    private <T> T convert(Object fromValue, Class<T> tClass) {
        return objectMapper.convertValue(fromValue, tClass);
    }
}
