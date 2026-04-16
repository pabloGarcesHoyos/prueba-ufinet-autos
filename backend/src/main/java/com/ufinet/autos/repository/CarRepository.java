package com.ufinet.autos.repository;

import com.ufinet.autos.entity.Car;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByUserId(Long userId);

    Optional<Car> findByIdAndUserId(Long id, Long userId);

    boolean existsByPlateNumber(String plateNumber);

    boolean existsByPlateNumberAndIdNot(String plateNumber, Long id);
}
