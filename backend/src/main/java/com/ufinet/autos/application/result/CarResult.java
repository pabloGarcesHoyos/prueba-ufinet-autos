package com.ufinet.autos.application.result;

public record CarResult(
        Long id,
        String brand,
        String model,
        Integer year,
        String plateNumber,
        String color
) {
}
