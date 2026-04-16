package com.ufinet.autos.service.impl;

import com.ufinet.autos.dto.request.LoginRequest;
import com.ufinet.autos.dto.request.RegisterRequest;
import com.ufinet.autos.dto.response.AuthResponse;
import com.ufinet.autos.entity.User;
import com.ufinet.autos.exception.DuplicateResourceException;
import com.ufinet.autos.repository.UserRepository;
import com.ufinet.autos.security.AuthenticatedUser;
import com.ufinet.autos.security.JwtService;
import com.ufinet.autos.service.interfaces.AuthService;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email is already registered.");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(AuthenticatedUser.from(savedUser));

        return buildAuthResponse(savedUser, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (BadCredentialsException exception) {
            throw new BadCredentialsException("Invalid email or password.", exception);
        }

        AuthenticatedUser principal = (AuthenticatedUser) authentication.getPrincipal();
        String token = jwtService.generateToken(principal);

        return buildAuthResponse(principal, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    private AuthResponse buildAuthResponse(AuthenticatedUser principal, String token) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(principal.getId())
                .name(principal.getName())
                .email(principal.getEmail())
                .build();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
