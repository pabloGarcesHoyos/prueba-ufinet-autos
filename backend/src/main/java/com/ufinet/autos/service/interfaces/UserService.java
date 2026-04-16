package com.ufinet.autos.service.interfaces;

import com.ufinet.autos.entity.User;
import java.util.Optional;

public interface UserService {

    Optional<User> findByEmail(String email);

    Optional<User> findById(Long userId);

    User getAuthenticatedUser();
}
