package com.uo.taxes.security;

import com.uo.taxes.security.domain.dto.TokenWrapperDto;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public interface AuthorizationApi {

    @GetMapping(value = "/auth/token")
    Mono<TokenWrapperDto> getToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization);
}
