package com.ufinet.autos.application.port.out;

import com.ufinet.autos.domain.model.User;

public interface TokenPort {

    String generateToken(User user);

    String extractSubject(String token);

    boolean isTokenValid(String token, User user);
}
