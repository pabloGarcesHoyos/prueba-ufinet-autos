package com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.repository;

import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.entity.CarEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataCarRepository extends JpaRepository<CarEntity, Long> {

    List<CarEntity> findByUserId(Long userId);

    Optional<CarEntity> findByIdAndUserId(Long id, Long userId);

    boolean existsByPlateNumber(String plateNumber);

    boolean existsByPlateNumberAndIdNot(String plateNumber, Long id);
}
