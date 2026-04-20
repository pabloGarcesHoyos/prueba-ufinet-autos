package com.ufinet.autos.application.command;

public record RegisterUserCommand(
        String name,
        String email,
        String password
) {
}
