package com.uo.taxes.security.presentation;

import com.uo.taxes.security.AuthorizationApi;
import com.uo.taxes.security.application.AuthorizationService;
import com.uo.taxes.security.domain.dto.TokenWrapperDto;
import com.uo.taxes.security.exception.MissingAuthorizationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import static org.springframework.security.web.server.ServerHttpBasicAuthenticationConverter.BASIC;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthorizationController implements AuthorizationApi {

    private final AuthorizationService authorizationService;
    
    @Override
    public Mono<TokenWrapperDto> getToken(String authorization) {
        if (authorization != null && authorization.startsWith(BASIC)) {
            return authorizationService.verifyCredentials(authorization);
        }
        return Mono
                .error(new MissingAuthorizationException("The resource you are trying to access needs authorization."));
    }
}
