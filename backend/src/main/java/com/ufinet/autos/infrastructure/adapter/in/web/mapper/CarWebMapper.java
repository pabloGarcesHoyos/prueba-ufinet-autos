package com.ufinet.autos.infrastructure.adapter.in.web.mapper;

import com.ufinet.autos.application.command.CreateCarCommand;
import com.ufinet.autos.application.command.UpdateCarCommand;
import com.ufinet.autos.application.result.CarResult;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.request.CreateCarRequest;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.request.UpdateCarRequest;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.response.CarResponse;
import org.springframework.stereotype.Component;

@Component
public class CarWebMapper {

    public CreateCarCommand toCommand(CreateCarRequest request) {
        return new CreateCarCommand(
                request.getBrand(),
                request.getModel(),
                request.getYear(),
                request.getPlateNumber(),
                request.getColor()
        );
    }

    public UpdateCarCommand toCommand(UpdateCarRequest request) {
        return new UpdateCarCommand(
                request.getBrand(),
                request.getModel(),
                request.getYear(),
                request.getPlateNumber(),
                request.getColor()
        );
    }

    public CarResponse toResponse(CarResult result) {
        return CarResponse.builder()
                .id(result.id())
                .brand(result.brand())
                .model(result.model())
                .year(result.year())
                .plateNumber(result.plateNumber())
                .color(result.color())
                .build();
    }
}
