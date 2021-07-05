package com.uo.taxes.rest;

import com.uo.taxes.domain.request.StudyRequestDto;
import com.uo.taxes.domain.response.StudyResponseDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/uo-taxes")
public interface StudyControllerApi {

    @PostMapping(path = "/create-study")
    void createStudy(@RequestBody StudyRequestDto request);

    @PutMapping(path = "/study/{id}")
    void updateStudy(@PathVariable Long id, @RequestBody StudyRequestDto request);

    @DeleteMapping(path = "/study/{id}")
    void deleteStudy(@PathVariable Long id);

    @DeleteMapping(path = "/active-study/{id}")
    void deleteActiveStudy(@PathVariable Long id);

    @GetMapping(path = "/studies")
    List<StudyResponseDto> getStudies();
}
