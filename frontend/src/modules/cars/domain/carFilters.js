export function buildBrandOptions(cars) {
  return [...new Set(cars.map((car) => car.brand))]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
}

export function buildYearOptions(cars) {
  return [...new Set(cars.map((car) => car.year))]
    .filter((year) => year !== null && year !== undefined)
    .sort((left, right) => right - left);
}

export function filterCars(cars, searchTerm, selectedBrand, selectedYear) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return cars.filter((car) => {
    const matchesSearch =
      !normalizedSearch ||
      car.plateNumber.toLowerCase().includes(normalizedSearch) ||
      car.model.toLowerCase().includes(normalizedSearch);

    const matchesBrand = !selectedBrand || car.brand === selectedBrand;
    const matchesYear = !selectedYear || String(car.year) === selectedYear;

    return matchesSearch && matchesBrand && matchesYear;
  });
}

export function buildResultLabel(filteredCarsCount, totalCars) {
  if (totalCars === 0) {
    return "Aún no tienes autos registrados.";
  }

  return `${filteredCarsCount} de ${totalCars} auto${totalCars === 1 ? "" : "s"} mostrados`;
}
