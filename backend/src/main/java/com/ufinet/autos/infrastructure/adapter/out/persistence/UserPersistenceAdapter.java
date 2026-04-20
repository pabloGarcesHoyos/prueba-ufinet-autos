package com.ufinet.autos.infrastructure.adapter.out.persistence;

import com.ufinet.autos.application.port.out.UserPersistencePort;
import com.ufinet.autos.domain.model.User;
import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.mapper.UserEntityMapper;
import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.repository.SpringDataUserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserPersistenceAdapter implements UserPersistencePort {

    private final SpringDataUserRepository userRepository;
    private final UserEntityMapper userEntityMapper;

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email).map(userEntityMapper::toDomain);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id).map(userEntityMapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User save(User user) {
        return userEntityMapper.toDomain(
                userRepository.save(userEntityMapper.toEntity(user))
        );
    }
}
