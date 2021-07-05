package com.uo.taxes.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uo.taxes.domain.HostelFeeEntity;
import com.uo.taxes.domain.request.HostelFeeRequestDto;
import com.uo.taxes.domain.response.HostelFeeResponseDto;
import com.uo.taxes.infrastructure.HostelFeeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HostelFeeService implements HostelFeeServiceApi {

    private final HostelFeeRepository hostelFeeRepository;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;

    @Override
    public void createHostelFee(HostelFeeRequestDto request) {
        HostelFeeEntity hostelFeeEntity = convert(request, HostelFeeEntity.class);
        hostelFeeRepository.save(hostelFeeEntity);
    }

    @Override
    public void updateHostelFee(Long id, HostelFeeRequestDto request) {
        HostelFeeEntity hostelFeeEntity = hostelFeeRepository.findById(id).orElseThrow(NullPointerException::new);
        modelMapper.map(request, hostelFeeEntity);
        hostelFeeRepository.save(hostelFeeEntity);
    }

    @Override
    public void deleteHostelFee(Long id) {
        hostelFeeRepository.deleteById(id);
    }

    @Override
    public List<HostelFeeResponseDto> getHostelFees() {
        List<HostelFeeEntity> hostelFeeEntities = hostelFeeRepository.findAll();
        return convertHostelFeeToDto(hostelFeeEntities);
    }

    private List<HostelFeeResponseDto> convertHostelFeeToDto(List<HostelFeeEntity> hostelFeeEntities) {
        return hostelFeeEntities.stream()
                .map(hostelFeeEntity -> convert(hostelFeeEntity, HostelFeeResponseDto.class))
                .collect(Collectors.toList());
    }

    private <T> T convert(Object fromValue, Class<T> tClass) {
        return objectMapper.convertValue(fromValue, tClass);
    }
}
