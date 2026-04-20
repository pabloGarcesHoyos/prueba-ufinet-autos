package com.ufinet.autos.infrastructure.adapter.out.persistence;

import com.ufinet.autos.application.port.out.CarPersistencePort;
import com.ufinet.autos.domain.exception.ResourceNotFoundException;
import com.ufinet.autos.domain.model.Car;
import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.entity.CarEntity;
import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.entity.UserEntity;
import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.mapper.CarEntityMapper;
import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.repository.SpringDataCarRepository;
import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.repository.SpringDataUserRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CarPersistenceAdapter implements CarPersistencePort {

    private final SpringDataCarRepository carRepository;
    private final SpringDataUserRepository userRepository;
    private final CarEntityMapper carEntityMapper;

    @Override
    public List<Car> findByUserId(Long userId) {
        return carRepository.findByUserId(userId)
                .stream()
                .map(carEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Car> findByIdAndUserId(Long id, Long userId) {
        return carRepository.findByIdAndUserId(id, userId).map(carEntityMapper::toDomain);
    }

    @Override
    public boolean existsByPlateNumber(String plateNumber) {
        return carRepository.existsByPlateNumber(plateNumber);
    }

    @Override
    public boolean existsByPlateNumberAndIdNot(String plateNumber, Long id) {
        return carRepository.existsByPlateNumberAndIdNot(plateNumber, id);
    }

    @Override
    public Car save(Car car) {
        UserEntity userEntity = userRepository.findById(car.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        CarEntity entity = car.getId() == null
                ? new CarEntity()
                : carRepository.findById(car.getId()).orElseGet(CarEntity::new);

        carEntityMapper.copyToEntity(car, entity, userEntity);
        return carEntityMapper.toDomain(carRepository.save(entity));
    }

    @Override
    public void delete(Car car) {
        carRepository.deleteById(car.getId());
    }
}
