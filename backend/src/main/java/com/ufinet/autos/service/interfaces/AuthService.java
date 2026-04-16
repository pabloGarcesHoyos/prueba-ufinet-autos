package com.ufinet.autos.service.interfaces;

import com.ufinet.autos.dto.request.LoginRequest;
import com.ufinet.autos.dto.request.RegisterRequest;
import com.ufinet.autos.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
