package com.ufinet.autos.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCarRequest {

    @NotBlank
    @Size(max = 60)
    private String brand;

    @NotBlank
    @Size(max = 60)
    private String model;

    @NotNull
    @Min(1886)
    @Max(2100)
    private Integer year;

    @NotBlank
    @Size(max = 20)
    private String plateNumber;

    @NotBlank
    @Size(max = 40)
    private String color;
}
