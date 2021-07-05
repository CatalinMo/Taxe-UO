package com.uo.taxes.rest;

import com.uo.taxes.domain.request.OtherFeeRequestDto;
import com.uo.taxes.domain.response.OtherFeeResponseDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/uo-taxes")
public interface OtherFeeControllerApi {

    @PostMapping(path = "/create-other-fee")
    void createOtherFee(@RequestBody OtherFeeRequestDto request);

    @PutMapping(path = "/other-fee/{id}")
    void updateOtherFee(@PathVariable Long id, @RequestBody OtherFeeRequestDto request);

    @DeleteMapping(path = "/other-fee/{id}")
    void deleteOtherFee(@PathVariable Long id);

    @GetMapping(path = "/other-fees")
    List<OtherFeeResponseDto> getOtherFees();
}
