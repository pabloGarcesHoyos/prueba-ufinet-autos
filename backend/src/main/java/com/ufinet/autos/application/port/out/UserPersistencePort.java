package com.ufinet.autos.application.port.out;

import com.ufinet.autos.domain.model.User;
import java.util.Optional;

public interface UserPersistencePort {

    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    boolean existsByEmail(String email);

    User save(User user);
}
