package com.ufinet.autos.infrastructure.adapter.in.web;

import com.ufinet.autos.application.port.in.AuthUseCase;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.request.LoginRequest;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.request.RegisterRequest;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.response.AuthResponse;
import com.ufinet.autos.infrastructure.adapter.in.web.mapper.AuthWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthUseCase authUseCase;
    private final AuthWebMapper authWebMapper;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authWebMapper.toResponse(
                        authUseCase.register(authWebMapper.toCommand(request))
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(
                authWebMapper.toResponse(authUseCase.login(authWebMapper.toCommand(request)))
        );
    }
}
