package com.uo.taxes.application;

import com.uo.taxes.domain.request.HostelFeeRequestDto;
import com.uo.taxes.domain.response.HostelFeeResponseDto;

import java.util.List;

public interface HostelFeeServiceApi {

    void createHostelFee(HostelFeeRequestDto request);

    void updateHostelFee(Long id, HostelFeeRequestDto request);

    void deleteHostelFee(Long id);

    List<HostelFeeResponseDto> getHostelFees();
}
