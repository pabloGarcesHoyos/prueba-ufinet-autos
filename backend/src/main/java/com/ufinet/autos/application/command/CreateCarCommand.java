package com.ufinet.autos.application.command;

public record CreateCarCommand(
        String brand,
        String model,
        Integer year,
        String plateNumber,
        String color
) {
}
