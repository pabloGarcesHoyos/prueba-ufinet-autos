package com.ufinet.autos.service.impl;

import com.ufinet.autos.dto.request.CreateCarRequest;
import com.ufinet.autos.dto.request.UpdateCarRequest;
import com.ufinet.autos.dto.response.CarResponse;
import com.ufinet.autos.entity.Car;
import com.ufinet.autos.entity.User;
import com.ufinet.autos.exception.DuplicateResourceException;
import com.ufinet.autos.exception.ResourceNotFoundException;
import com.ufinet.autos.repository.CarRepository;
import com.ufinet.autos.service.interfaces.CarService;
import com.ufinet.autos.service.interfaces.UserService;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;
    private final UserService userService;

    @Override
    @Transactional
    public CarResponse createCar(CreateCarRequest request) {
        User authenticatedUser = userService.getAuthenticatedUser();
        String normalizedPlateNumber = normalizePlateNumber(request.getPlateNumber());

        if (carRepository.existsByPlateNumber(normalizedPlateNumber)) {
            throw new DuplicateResourceException("Plate number is already registered.");
        }

        Car car = Car.builder()
                .brand(request.getBrand().trim())
                .model(request.getModel().trim())
                .year(request.getYear())
                .plateNumber(normalizedPlateNumber)
                .color(request.getColor().trim())
                .user(authenticatedUser)
                .build();

        return mapToResponse(carRepository.save(car));
    }

    @Override
    public List<CarResponse> getCars() {
        Long userId = userService.getAuthenticatedUser().getId();
        return carRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CarResponse getCarById(Long id) {
        return mapToResponse(getOwnedCar(id));
    }

    @Override
    @Transactional
    public CarResponse updateCar(Long id, UpdateCarRequest request) {
        Car car = getOwnedCar(id);
        String normalizedPlateNumber = normalizePlateNumber(request.getPlateNumber());

        if (carRepository.existsByPlateNumberAndIdNot(normalizedPlateNumber, id)) {
            throw new DuplicateResourceException("Plate number is already registered.");
        }

        car.setBrand(request.getBrand().trim());
        car.setModel(request.getModel().trim());
        car.setYear(request.getYear());
        car.setPlateNumber(normalizedPlateNumber);
        car.setColor(request.getColor().trim());

        return mapToResponse(carRepository.save(car));
    }

    @Override
    @Transactional
    public void deleteCar(Long id) {
        carRepository.delete(getOwnedCar(id));
    }

    private Car getOwnedCar(Long carId) {
        Long userId = userService.getAuthenticatedUser().getId();
        return carRepository.findByIdAndUserId(carId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found."));
    }

    private CarResponse mapToResponse(Car car) {
        return CarResponse.builder()
                .id(car.getId())
                .brand(car.getBrand())
                .model(car.getModel())
                .year(car.getYear())
                .plateNumber(car.getPlateNumber())
                .color(car.getColor())
                .build();
    }

    private String normalizePlateNumber(String plateNumber) {
        return plateNumber.trim().toUpperCase(Locale.ROOT);
    }
}
