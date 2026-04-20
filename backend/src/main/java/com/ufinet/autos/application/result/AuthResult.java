package com.ufinet.autos.application.result;

public record AuthResult(
        String token,
        String type,
        Long userId,
        String name,
        String email
) {
}
