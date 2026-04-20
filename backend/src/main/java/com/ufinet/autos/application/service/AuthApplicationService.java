package com.ufinet.autos.application.service;

import com.ufinet.autos.application.command.LoginCommand;
import com.ufinet.autos.application.command.RegisterUserCommand;
import com.ufinet.autos.application.port.in.AuthUseCase;
import com.ufinet.autos.application.port.out.AuthenticationPort;
import com.ufinet.autos.application.port.out.PasswordHashPort;
import com.ufinet.autos.application.port.out.TokenPort;
import com.ufinet.autos.application.port.out.UserPersistencePort;
import com.ufinet.autos.application.result.AuthResult;
import com.ufinet.autos.domain.exception.DuplicateResourceException;
import com.ufinet.autos.domain.model.User;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthApplicationService implements AuthUseCase {

    private final UserPersistencePort userPersistencePort;
    private final PasswordHashPort passwordHashPort;
    private final AuthenticationPort authenticationPort;
    private final TokenPort tokenPort;

    @Override
    @Transactional
    public AuthResult register(RegisterUserCommand command) {
        String email = normalizeEmail(command.email());

        if (userPersistencePort.existsByEmail(email)) {
            throw new DuplicateResourceException("Email is already registered.");
        }

        User user = User.builder()
                .name(command.name().trim())
                .email(email)
                .password(passwordHashPort.hash(command.password()))
                .build();

        User savedUser = userPersistencePort.save(user);
        String token = tokenPort.generateToken(savedUser);

        return new AuthResult(
                token,
                "Bearer",
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    @Override
    public AuthResult login(LoginCommand command) {
        String email = normalizeEmail(command.email());
        User authenticatedUser = authenticationPort.authenticate(email, command.password());
        String token = tokenPort.generateToken(authenticatedUser);

        return new AuthResult(
                token,
                "Bearer",
                authenticatedUser.getId(),
                authenticatedUser.getName(),
                authenticatedUser.getEmail()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
