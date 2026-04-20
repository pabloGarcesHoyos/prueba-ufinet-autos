package com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.mapper;

import com.ufinet.autos.domain.model.Car;
import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.entity.CarEntity;
import com.ufinet.autos.infrastructure.adapter.out.persistence.jpa.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class CarEntityMapper {

    public Car toDomain(CarEntity entity) {
        return Car.builder()
                .id(entity.getId())
                .brand(entity.getBrand())
                .model(entity.getModel())
                .year(entity.getYear())
                .plateNumber(entity.getPlateNumber())
                .color(entity.getColor())
                .userId(entity.getUser().getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void copyToEntity(Car car, CarEntity entity, UserEntity userEntity) {
        entity.setBrand(car.getBrand());
        entity.setModel(car.getModel());
        entity.setYear(car.getYear());
        entity.setPlateNumber(car.getPlateNumber());
        entity.setColor(car.getColor());
        entity.setUser(userEntity);
    }
}
