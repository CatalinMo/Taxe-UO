package com.uo.taxes.rest;

import com.uo.taxes.application.HostelFeeServiceApi;
import com.uo.taxes.domain.request.HostelFeeRequestDto;
import com.uo.taxes.domain.response.HostelFeeResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HostelFeeControllerImpl implements HostelFeeControllerApi {

    private final HostelFeeServiceApi hostelFeeService;

    @Override
    public void createHostelFee(HostelFeeRequestDto request) {
        hostelFeeService.createHostelFee(request);
    }

    @Override
    public void updateHostelFee(Long id, HostelFeeRequestDto request) {
        hostelFeeService.updateHostelFee(id, request);
    }

    @Override
    public void deleteHostelFee(Long id) {
        hostelFeeService.deleteHostelFee(id);
    }

    @Override
    public List<HostelFeeResponseDto> getHostelFees() {
        return hostelFeeService.getHostelFees();
    }
}
