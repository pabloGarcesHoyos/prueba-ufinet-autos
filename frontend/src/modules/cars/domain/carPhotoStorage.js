import { CAR_PHOTO_STORAGE_KEY } from "../../../shared/config/constants";

export function getStoredCarPhotos() {
  const rawValue = localStorage.getItem(CAR_PHOTO_STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch {
    localStorage.removeItem(CAR_PHOTO_STORAGE_KEY);
    return {};
  }
}

export function getCarPhotoName(photos, carId) {
  return photos[String(carId)] || "";
}

export function updateStoredCarPhoto(currentPhotos, carId, photoName) {
  if (!carId) {
    return currentPhotos;
  }

  const normalizedPhotoName = photoName.trim();
  const nextPhotos = { ...currentPhotos };

  if (normalizedPhotoName) {
    nextPhotos[String(carId)] = normalizedPhotoName;
  } else {
    delete nextPhotos[String(carId)];
  }

  localStorage.setItem(CAR_PHOTO_STORAGE_KEY, JSON.stringify(nextPhotos));
  return nextPhotos;
}

export function removeStoredCarPhoto(currentPhotos, carId) {
  if (!carId || !currentPhotos[String(carId)]) {
    return currentPhotos;
  }

  const nextPhotos = { ...currentPhotos };
  delete nextPhotos[String(carId)];
  localStorage.setItem(CAR_PHOTO_STORAGE_KEY, JSON.stringify(nextPhotos));
  return nextPhotos;
}
