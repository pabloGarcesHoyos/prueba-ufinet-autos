package com.ufinet.autos.application.service;

import com.ufinet.autos.application.port.in.UserQueryUseCase;
import com.ufinet.autos.application.port.out.CurrentUserPort;
import com.ufinet.autos.application.port.out.UserPersistencePort;
import com.ufinet.autos.domain.model.User;
import java.util.Locale;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserApplicationService implements UserQueryUseCase {

    private final UserPersistencePort userPersistencePort;
    private final CurrentUserPort currentUserPort;

    @Override
    public Optional<User> findByEmail(String email) {
        return userPersistencePort.findByEmail(normalizeEmail(email));
    }

    @Override
    public Optional<User> findById(Long userId) {
        return userPersistencePort.findById(userId);
    }

    @Override
    public User getAuthenticatedUser() {
        return currentUserPort.getCurrentUser();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
