package com.ufinet.autos.application.port.out;

public interface PasswordHashPort {

    String hash(String rawPassword);
}
