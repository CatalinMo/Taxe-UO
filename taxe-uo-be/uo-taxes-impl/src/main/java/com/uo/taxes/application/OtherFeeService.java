package com.uo.taxes.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uo.taxes.domain.OtherFeeEntity;
import com.uo.taxes.domain.request.OtherFeeRequestDto;
import com.uo.taxes.domain.response.OtherFeeResponseDto;
import com.uo.taxes.infrastructure.OtherFeeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class OtherFeeService implements OtherFeeServiceApi {

    private final OtherFeeRepository otherFeeRepository;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;

    @Override
    public void createOtherFee(OtherFeeRequestDto request) {
        OtherFeeEntity otherFeeEntity = convert(request, OtherFeeEntity.class);
        otherFeeRepository.save(otherFeeEntity);
    }

    @Override
    public void updateOtherFee(Long id, OtherFeeRequestDto request) {
        OtherFeeEntity otherFeeEntity = otherFeeRepository.findById(id).orElseThrow(NullPointerException::new);
        modelMapper.map(request, otherFeeEntity);
        otherFeeRepository.save(otherFeeEntity);
    }

    @Override
    public void deleteOtherFee(Long id) {
        otherFeeRepository.deleteById(id);
    }

    @Override
    public List<OtherFeeResponseDto> getOtherFees() {
        List<OtherFeeEntity> otherFeeEntities = otherFeeRepository.findAll();
        return convertOtherFeeToDto(otherFeeEntities);
    }

    private List<OtherFeeResponseDto> convertOtherFeeToDto(List<OtherFeeEntity> otherFeeEntities) {
        return otherFeeEntities.stream()
                .map(otherFeeEntity -> convert(otherFeeEntity, OtherFeeResponseDto.class))
                .collect(Collectors.toList());
    }

    private <T> T convert(Object fromValue, Class<T> tClass) {
        return objectMapper.convertValue(fromValue, tClass);
    }
}
