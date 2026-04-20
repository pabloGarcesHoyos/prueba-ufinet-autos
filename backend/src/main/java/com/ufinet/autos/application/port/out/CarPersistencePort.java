package com.ufinet.autos.application.port.out;

import com.ufinet.autos.domain.model.Car;
import java.util.List;
import java.util.Optional;

public interface CarPersistencePort {

    List<Car> findByUserId(Long userId);

    Optional<Car> findByIdAndUserId(Long id, Long userId);

    boolean existsByPlateNumber(String plateNumber);

    boolean existsByPlateNumberAndIdNot(String plateNumber, Long id);

    Car save(Car car);

    void delete(Car car);
}
