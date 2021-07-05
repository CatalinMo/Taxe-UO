package com.uo.taxes.rest;

import com.uo.taxes.domain.request.StudyFeeRequestDto;
import com.uo.taxes.domain.response.StudyFeeResponseDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/uo-taxes")
public interface StudyFeeControllerApi {

    @PutMapping(path = "/study-fee/{id}")
    void updateStudyFee(@PathVariable Long id, @RequestBody StudyFeeRequestDto request);

    @DeleteMapping(path = "/study-fee/{id}")
    void deleteStudyFee(@PathVariable Long id);

    @GetMapping(path = "/study-fees")
    List<StudyFeeResponseDto> getStudyFees();
}
