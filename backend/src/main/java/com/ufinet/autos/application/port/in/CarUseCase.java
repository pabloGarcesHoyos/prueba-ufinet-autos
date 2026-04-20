package com.ufinet.autos.application.port.in;

import com.ufinet.autos.application.command.CreateCarCommand;
import com.ufinet.autos.application.command.UpdateCarCommand;
import com.ufinet.autos.application.result.CarResult;
import java.util.List;

public interface CarUseCase {

    CarResult createCar(CreateCarCommand command);

    List<CarResult> getCars();

    CarResult getCarById(Long id);

    CarResult updateCar(Long id, UpdateCarCommand command);

    void deleteCar(Long id);
}
