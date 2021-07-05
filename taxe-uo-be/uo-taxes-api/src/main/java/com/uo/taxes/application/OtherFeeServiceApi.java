package com.uo.taxes.application;

import com.uo.taxes.domain.request.OtherFeeRequestDto;
import com.uo.taxes.domain.response.OtherFeeResponseDto;

import java.util.List;

public interface OtherFeeServiceApi {

    void createOtherFee(OtherFeeRequestDto request);

    void updateOtherFee(Long id, OtherFeeRequestDto request);

    void deleteOtherFee(Long id);

    List<OtherFeeResponseDto> getOtherFees();
}
