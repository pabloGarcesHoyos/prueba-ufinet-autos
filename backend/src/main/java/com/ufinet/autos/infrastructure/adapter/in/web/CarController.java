package com.ufinet.autos.infrastructure.adapter.in.web;

import com.ufinet.autos.application.port.in.CarUseCase;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.request.CreateCarRequest;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.request.UpdateCarRequest;
import com.ufinet.autos.infrastructure.adapter.in.web.dto.response.CarResponse;
import com.ufinet.autos.infrastructure.adapter.in.web.mapper.CarWebMapper;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarUseCase carUseCase;
    private final CarWebMapper carWebMapper;

    @PostMapping
    public ResponseEntity<CarResponse> createCar(@Valid @RequestBody CreateCarRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(carWebMapper.toResponse(
                        carUseCase.createCar(carWebMapper.toCommand(request))
                ));
    }

    @GetMapping
    public ResponseEntity<List<CarResponse>> getCars() {
        return ResponseEntity.ok(
                carUseCase.getCars().stream().map(carWebMapper::toResponse).toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarResponse> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(carWebMapper.toResponse(carUseCase.getCarById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarResponse> updateCar(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCarRequest request
    ) {
        return ResponseEntity.ok(
                carWebMapper.toResponse(carUseCase.updateCar(id, carWebMapper.toCommand(request)))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carUseCase.deleteCar(id);
        return ResponseEntity.noContent().build();
    }
}
