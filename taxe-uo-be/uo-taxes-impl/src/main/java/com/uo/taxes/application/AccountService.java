package com.uo.taxes.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uo.taxes.config.properties.UserProperties;
import com.uo.taxes.domain.*;
import com.uo.taxes.domain.request.AccountRequestDto;
import com.uo.taxes.domain.request.ActiveFeeRequestDto;
import com.uo.taxes.domain.request.AssignFeeToAccountRequestDto;
import com.uo.taxes.domain.request.MarkFeeAsPaidRequestDto;
import com.uo.taxes.domain.response.*;
import com.uo.taxes.exception.BadUserException;
import com.uo.taxes.infrastructure.AccountRepository;
import com.uo.taxes.infrastructure.ActiveFeeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AccountService implements AccountServiceApi {

    private final AccountRepository accountRepository;
    private final ActiveFeeRepository activeFeeRepository;
    private final UserProperties userProperties;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;

    @Override
    public void createAccount(AccountRequestDto request) {
        if (accountRepository.findByCnp(request.getCnp()) == null) {
            AccountEntity accountEntity = convert(request, AccountEntity.class);
            accountEntity.setPassword(getEncodedPassword(userProperties.getDefaultPassword()));
            accountEntity.setRole(userProperties.getRole());
            accountRepository.save(accountEntity);
        }
    }

    @Override
    public void updateAccount(Long id, AccountRequestDto request) {
        AccountEntity accountEntity = accountRepository.findById(id).orElseThrow(NullPointerException::new);
        modelMapper.map(request, accountEntity);
        accountRepository.save(accountEntity);
    }

    @Override
    public void updateActiveFee(Long id, ActiveFeeRequestDto request) {
        ActiveFeeEntity activeFeeEntity = activeFeeRepository.findById(id).orElseThrow(NullPointerException::new);
        modelMapper.map(request, activeFeeEntity);
        activeFeeRepository.save(activeFeeEntity);
    }

    @Override
    public void assignFeeToAccounts(AssignFeeToAccountRequestDto request) {
        List<AccountEntity> accountEntities = accountRepository.findAllById(request.getIds());
        ActiveFeeEntity activeFeeEntity = convert(request.getActiveFee(), ActiveFeeEntity.class);
        accountEntities.forEach(accountEntity -> accountEntity.getActiveFees().add(activeFeeEntity));
        accountRepository.saveAll(accountEntities);
    }

    @Override
    public void markFeeAsPaid(MarkFeeAsPaidRequestDto request) {
        activeFeeRepository.deleteById(request.getActiveFeeId());
        AccountEntity accountEntity = accountRepository.findById(request.getAccountId()).orElseThrow(NullPointerException::new);
        modelMapper.map(request.getAccountRequest(), accountEntity);
        accountEntity.setActiveFees(removeActiveFeeEntity(accountEntity.getActiveFees(), request.getActiveFeeId()));
        accountRepository.save(accountEntity);
    }

    @Override
    public void changePassword(Long id, String newPassword) {
        AccountEntity accountEntity = accountRepository.findById(id).orElseThrow(NullPointerException::new);
        accountEntity.setPassword(getEncodedPassword(newPassword));
        accountRepository.save(accountEntity);
    }

    @Override
    public void deleteAccount(Long id) {
        accountRepository.deleteById(id);
    }

    @Override
    public void deleteAccountActiveFee(Long id) {
        activeFeeRepository.deleteById(id);
    }

    @Override
    public List<AccountResponseDto> getAccounts() {
        List<AccountEntity> accountEntities = accountRepository.findAll();
        return convertAccountToDto(accountEntities);
    }

    @Override
    public AccountResponseDto getAccountByEmail(String email) {
        AccountEntity accountEntity = accountRepository.findByEmail(email);
        return convertAccount(accountEntity);
    }

    @Override
    public AccountResponseDto getAccountByCnp(String cnp) {
        AccountEntity accountEntity = accountRepository.findByCnp(cnp);
        return convertAccount(accountEntity);
    }

    @Override
    public List<ActiveFeeResponseDto> getActiveFees() {
        List<ActiveFeeEntity> activeFeeEntities = activeFeeRepository.findAll();
        return convertActiveFeeToDto(activeFeeEntities);
    }

    @Override
    public UserIdentityResponseDto getUserIdentity(String user, String password) {
        if (accountRepository.findByCnp(user) != null) {
            AccountEntity accountEntity = accountRepository.findByCnp(user);
            return checkUserAndReturn(accountEntity, password);
        }
        else if (accountRepository.findByEmail(user) != null
                && accountRepository.findByEmail(user).getCnp() == null) {
            AccountEntity accountEntity = accountRepository.findByEmail(user);
            return checkUserAndReturn(accountEntity, password);
        }
        throw new BadUserException("Utilizator greșit");
    }

    private String getEncodedPassword(String password) {
        return Base64.getEncoder().encodeToString(password.getBytes());
    }

    private String getDecodedPassword(String encodedPassword) {
        return new String(Base64.getDecoder().decode(encodedPassword.getBytes()));
    }

    private Set<ActiveFeeEntity> removeActiveFeeEntity(Set<ActiveFeeEntity> activeFeeEntities, Long paidFeeId) {
        return activeFeeEntities.stream()
                .filter(activeFeeEntity -> !activeFeeEntity.getId().equals(paidFeeId))
                .collect(Collectors.toSet());
    }

    private List<AccountResponseDto> convertAccountToDto(List<AccountEntity> accountEntities) {
        return accountEntities.stream()
                .map(this::convertAccount)
                .collect(Collectors.toList());
    }

    private List<ActiveFeeResponseDto> convertActiveFeeToDto(List<ActiveFeeEntity> activeFeeEntities) {
        return activeFeeEntities.stream()
                .map(this::convertActiveFee)
                .collect(Collectors.toList());
    }

    private UserIdentityResponseDto checkUserAndReturn(AccountEntity accountEntity, String password) {
        if (password.equals(getDecodedPassword(accountEntity.getPassword()))) {
            return convert(accountEntity, UserIdentityResponseDto.class);
        }
        throw new BadUserException("Utilizator greșit");
    }

    private AccountResponseDto convertAccount(AccountEntity accountEntity) {
        AccountResponseDto accountResponse = new AccountResponseDto();
        accountResponse.setId(accountEntity.getId());
        accountResponse.setFirstName(accountEntity.getFirstName());
        accountResponse.setLastName(accountEntity.getLastName());
        accountResponse.setCnp(accountEntity.getCnp());
        accountResponse.setEmail(accountEntity.getEmail());
        accountResponse.setPhone(accountEntity.getPhone());
        accountResponse.setActiveStudies(new ArrayList(accountEntity.getActiveStudies()));
        accountResponse.setActiveFees(new ArrayList(accountEntity.getActiveFees()));
        accountResponse.setPaidFees(new ArrayList(accountEntity.getPaidFees()));
        return accountResponse;
    }

    private ActiveFeeResponseDto convertActiveFee(ActiveFeeEntity activeFeeEntity) {
        ActiveFeeResponseDto activeFeeResponse = new ActiveFeeResponseDto();
        activeFeeResponse.setId(activeFeeEntity.getId());
        activeFeeResponse.setName(activeFeeEntity.getName());
        activeFeeResponse.setDetails(activeFeeEntity.getDetails());
        activeFeeResponse.setComment(activeFeeEntity.getComment());
        activeFeeResponse.setLimitDate(activeFeeEntity.getLimitDate());
        activeFeeResponse.setValue(activeFeeEntity.getValue());
        activeFeeResponse.setAccount(convertAccount(activeFeeEntity.getAccount()));
        return activeFeeResponse;
    }

    private <T> T convert(Object fromValue, Class<T> tClass) {
        return objectMapper.convertValue(fromValue, tClass);
    }
}
