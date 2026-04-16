package com.ufinet.autos.service.interfaces;

import com.ufinet.autos.dto.request.CreateCarRequest;
import com.ufinet.autos.dto.request.UpdateCarRequest;
import com.ufinet.autos.dto.response.CarResponse;
import java.util.List;

public interface CarService {

    CarResponse createCar(CreateCarRequest request);

    List<CarResponse> getCars();

    CarResponse getCarById(Long id);

    CarResponse updateCar(Long id, UpdateCarRequest request);

    void deleteCar(Long id);
}
