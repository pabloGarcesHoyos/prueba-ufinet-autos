package com.ufinet.autos.application.port.in;

import com.ufinet.autos.domain.model.User;
import java.util.Optional;

public interface UserQueryUseCase {

    Optional<User> findByEmail(String email);

    Optional<User> findById(Long userId);

    User getAuthenticatedUser();
}
