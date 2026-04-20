package com.ufinet.autos.application.command;

public record UpdateCarCommand(
        String brand,
        String model,
        Integer year,
        String plateNumber,
        String color
) {
}
