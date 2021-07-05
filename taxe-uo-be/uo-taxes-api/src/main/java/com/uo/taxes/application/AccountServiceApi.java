package com.uo.taxes.application;

import com.uo.taxes.domain.request.AccountRequestDto;
import com.uo.taxes.domain.request.ActiveFeeRequestDto;
import com.uo.taxes.domain.request.AssignFeeToAccountRequestDto;
import com.uo.taxes.domain.request.MarkFeeAsPaidRequestDto;
import com.uo.taxes.domain.response.AccountResponseDto;
import com.uo.taxes.domain.response.ActiveFeeResponseDto;
import com.uo.taxes.domain.response.UserIdentityResponseDto;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface AccountServiceApi {

    void createAccount(AccountRequestDto request);

    void updateAccount(Long id, AccountRequestDto request);

    void updateActiveFee(Long id, ActiveFeeRequestDto request);

    void assignFeeToAccounts(AssignFeeToAccountRequestDto request);

    void markFeeAsPaid(MarkFeeAsPaidRequestDto request);

    void changePassword(Long id, String newPassword);

    void deleteAccount(Long id);

    void deleteAccountActiveFee(Long id);

    List<AccountResponseDto> getAccounts();

    AccountResponseDto getAccountByEmail(String email);

    AccountResponseDto getAccountByCnp(String cnp);

    List<ActiveFeeResponseDto> getActiveFees();

    UserIdentityResponseDto getUserIdentity(String user, String password);
}
