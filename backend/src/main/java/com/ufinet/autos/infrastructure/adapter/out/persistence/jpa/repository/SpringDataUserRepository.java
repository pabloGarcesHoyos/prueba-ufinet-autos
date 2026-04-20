package com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.repository;

import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataUserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
