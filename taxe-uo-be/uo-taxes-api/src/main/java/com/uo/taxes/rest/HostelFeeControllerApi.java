package com.uo.taxes.rest;

import com.uo.taxes.domain.request.HostelFeeRequestDto;
import com.uo.taxes.domain.response.HostelFeeResponseDto;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/uo-taxes")
public interface HostelFeeControllerApi {

    @PostMapping(path = "/create-hostel-fee")
    void createHostelFee(@RequestBody HostelFeeRequestDto request);

    @PutMapping(path = "/hostel-fee/{id}")
    void updateHostelFee(@PathVariable Long id, @RequestBody HostelFeeRequestDto request);

    @DeleteMapping(path = "/hostel-fee/{id}")
    void deleteHostelFee(@PathVariable Long id);

    @GetMapping(path = "/hostel-fees")
    List<HostelFeeResponseDto> getHostelFees();
}
