package com.ufinet.autos.infrastructure.adapter.out.security;

import com.ufinet.autos.application.port.out.UserPersistencePort;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserPersistencePort userPersistencePort;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userPersistencePort.findByEmail(normalizeEmail(username))
                .map(SecurityAuthenticatedUser::from)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
