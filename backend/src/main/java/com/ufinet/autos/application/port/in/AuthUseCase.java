package com.ufinet.autos.application.port.in;

import com.ufinet.autos.application.command.LoginCommand;
import com.ufinet.autos.application.command.RegisterUserCommand;
import com.ufinet.autos.application.result.AuthResult;

public interface AuthUseCase {

    AuthResult register(RegisterUserCommand command);

    AuthResult login(LoginCommand command);
}
