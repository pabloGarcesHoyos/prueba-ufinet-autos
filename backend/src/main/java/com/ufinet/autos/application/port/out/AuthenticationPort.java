package com.ufinet.autos.application.port.out;

import com.ufinet.autos.domain.model.User;

public interface AuthenticationPort {

    User authenticate(String email, String password);
}
