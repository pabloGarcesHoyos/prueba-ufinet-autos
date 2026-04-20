package com.ufinet.autos.infrastructure.adapter.out.security;

import com.ufinet.autos.application.port.out.CurrentUserPort;
import com.ufinet.autos.application.port.out.UserPersistencePort;
import com.ufinet.autos.domain.exception.ResourceNotFoundException;
import com.ufinet.autos.domain.model.User;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityCurrentUserAdapter implements CurrentUserPort {

    private final UserPersistencePort userPersistencePort;

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new AuthenticationCredentialsNotFoundException("Authenticated user could not be resolved.");
        }

        String email = authentication.getName().trim().toLowerCase(Locale.ROOT);
        return userPersistencePort.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user was not found."));
    }
}
