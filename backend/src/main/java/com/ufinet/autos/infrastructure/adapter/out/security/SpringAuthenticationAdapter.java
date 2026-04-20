package com.ufinet.autos.infrastructure.adapter.out.security;

import com.ufinet.autos.application.port.out.AuthenticationPort;
import com.ufinet.autos.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SpringAuthenticationAdapter implements AuthenticationPort {

    private final AuthenticationManager authenticationManager;

    @Override
    public User authenticate(String email, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            SecurityAuthenticatedUser principal = (SecurityAuthenticatedUser) authentication.getPrincipal();
            return principal.toDomain();
        } catch (BadCredentialsException exception) {
            throw new BadCredentialsException("Invalid email or password.", exception);
        }
    }
}
