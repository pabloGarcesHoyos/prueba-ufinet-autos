package com.ufinet.autos.application.service;

import com.ufinet.autos.application.command.CreateCarCommand;
import com.ufinet.autos.application.command.UpdateCarCommand;
import com.ufinet.autos.application.port.in.CarUseCase;
import com.ufinet.autos.application.port.in.UserQueryUseCase;
import com.ufinet.autos.application.port.out.CarPersistencePort;
import com.ufinet.autos.application.result.CarResult;
import com.ufinet.autos.domain.exception.DuplicateResourceException;
import com.ufinet.autos.domain.exception.ResourceNotFoundException;
import com.ufinet.autos.domain.model.Car;
import com.ufinet.autos.domain.model.User;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarApplicationService implements CarUseCase {

    private final CarPersistencePort carPersistencePort;
    private final UserQueryUseCase userQueryUseCase;

    @Override
    @Transactional
    public CarResult createCar(CreateCarCommand command) {
        User authenticatedUser = userQueryUseCase.getAuthenticatedUser();
        String normalizedPlateNumber = normalizePlateNumber(command.plateNumber());

        if (carPersistencePort.existsByPlateNumber(normalizedPlateNumber)) {
            throw new DuplicateResourceException("Plate number is already registered.");
        }

        Car car = Car.builder()
                .brand(command.brand().trim())
                .model(command.model().trim())
                .year(command.year())
                .plateNumber(normalizedPlateNumber)
                .color(command.color().trim())
                .userId(authenticatedUser.getId())
                .build();

        return toResult(carPersistencePort.save(car));
    }

    @Override
    public List<CarResult> getCars() {
        Long userId = userQueryUseCase.getAuthenticatedUser().getId();
        return carPersistencePort.findByUserId(userId)
                .stream()
                .map(this::toResult)
                .toList();
    }

    @Override
    public CarResult getCarById(Long id) {
        return toResult(getOwnedCar(id));
    }

    @Override
    @Transactional
    public CarResult updateCar(Long id, UpdateCarCommand command) {
        Car car = getOwnedCar(id);
        String normalizedPlateNumber = normalizePlateNumber(command.plateNumber());

        if (carPersistencePort.existsByPlateNumberAndIdNot(normalizedPlateNumber, id)) {
            throw new DuplicateResourceException("Plate number is already registered.");
        }

        car.setBrand(command.brand().trim());
        car.setModel(command.model().trim());
        car.setYear(command.year());
        car.setPlateNumber(normalizedPlateNumber);
        car.setColor(command.color().trim());

        return toResult(carPersistencePort.save(car));
    }

    @Override
    @Transactional
    public void deleteCar(Long id) {
        carPersistencePort.delete(getOwnedCar(id));
    }

    private Car getOwnedCar(Long carId) {
        Long userId = userQueryUseCase.getAuthenticatedUser().getId();
        return carPersistencePort.findByIdAndUserId(carId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found."));
    }

    private CarResult toResult(Car car) {
        return new CarResult(
                car.getId(),
                car.getBrand(),
                car.getModel(),
                car.getYear(),
                car.getPlateNumber(),
                car.getColor()
        );
    }

    private String normalizePlateNumber(String plateNumber) {
        return plateNumber.trim().toUpperCase(Locale.ROOT);
    }
}
