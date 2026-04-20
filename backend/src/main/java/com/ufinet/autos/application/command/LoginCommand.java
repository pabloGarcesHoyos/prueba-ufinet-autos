package com.ufinet.autos.application.command;

public record LoginCommand(
        String email,
        String password
) {
}
