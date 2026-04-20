package com.ufinet.autos.infrastructure.adapter.in.web.mapper;

import com.ufinet.autos.application.command.LoginCommand;
import com.ufinet.autos.application.command.RegisterUserCommand;
import com.ufinet.autos.application.result.AuthResult;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.request.LoginRequest;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.request.RegisterRequest;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.response.AuthResponse;
import org.springframework.stereotype.Component;

@Component
public class AuthWebMapper {

    public RegisterUserCommand toCommand(RegisterRequest request) {
        return new RegisterUserCommand(
                request.getName(),
                request.getEmail(),
                request.getPassword()
        );
    }

    public LoginCommand toCommand(LoginRequest request) {
        return new LoginCommand(
                request.getEmail(),
                request.getPassword()
        );
    }

    public AuthResponse toResponse(AuthResult result) {
        return AuthResponse.builder()
                .token(result.token())
                .type(result.type())
                .userId(result.userId())
                .name(result.name())
                .email(result.email())
                .build();
    }
}
