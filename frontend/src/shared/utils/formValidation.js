const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/;
const TEXT_PATTERN = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.&-]+$/;
const MODEL_PATTERN = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.-]+$/;
const PLATE_PATTERN = /^[A-Z0-9-]{4,10}$/;
const PHOTO_NAME_PATTERN = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s._()-]+$/;

const MAX_NAME_LENGTH = 80;
const MAX_TEXT_LENGTH = 50;
const MAX_MODEL_LENGTH = 50;
const MAX_PLATE_LENGTH = 10;
const MAX_COLOR_LENGTH = 30;
const MAX_PHOTO_NAME_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 8;
const MIN_YEAR = 1886;
const MAX_YEAR = new Date().getFullYear() + 1;

function normalizeSpaces(value) {
  return value.replace(/\s+/g, " ").trim();
}

function sanitizeNameValue(value) {
  return value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]/g, "").slice(0, MAX_NAME_LENGTH);
}

function sanitizeTextValue(value) {
  return value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.&-]/g, "").slice(0, MAX_TEXT_LENGTH);
}

function sanitizeColorValue(value) {
  return value
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.&-]/g, "")
    .slice(0, MAX_COLOR_LENGTH);
}

function sanitizeModelValue(value) {
  return value
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.-]/g, "")
    .slice(0, MAX_MODEL_LENGTH);
}

function sanitizeYearValue(value) {
  return value.replace(/\D/g, "").slice(0, 4);
}

function sanitizePlateValue(value) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, MAX_PLATE_LENGTH);
}

function sanitizeEmailValue(value) {
  return value.replace(/\s+/g, "").slice(0, 120);
}

function sanitizePhotoNameValue(value) {
  return value
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s._()-]/g, "")
    .slice(0, MAX_PHOTO_NAME_LENGTH);
}

export function sanitizeRegisterField(name, value) {
  switch (name) {
    case "name":
      return sanitizeNameValue(value);
    case "email":
      return sanitizeEmailValue(value);
    default:
      return value;
  }
}

export function sanitizeLoginField(name, value) {
  if (name === "email") {
    return sanitizeEmailValue(value);
  }

  return value;
}

export function sanitizeCarField(name, value) {
  switch (name) {
    case "brand":
      return sanitizeTextValue(value);
    case "model":
      return sanitizeModelValue(value);
    case "year":
      return sanitizeYearValue(value);
    case "plateNumber":
      return sanitizePlateValue(value);
    case "color":
      return sanitizeColorValue(value);
    case "photoName":
      return sanitizePhotoNameValue(value);
    default:
      return value;
  }
}

export function normalizeRegisterValues(values) {
  return {
    name: normalizeSpaces(values.name || ""),
    email: (values.email || "").trim().toLowerCase(),
    password: values.password || "",
  };
}

export function normalizeLoginValues(values) {
  return {
    email: (values.email || "").trim().toLowerCase(),
    password: values.password || "",
  };
}

export function normalizeCarValues(values) {
  return {
    brand: normalizeSpaces(values.brand || ""),
    model: normalizeSpaces(values.model || ""),
    year: values.year || "",
    plateNumber: (values.plateNumber || "").trim().toUpperCase(),
    color: normalizeSpaces(values.color || ""),
    photoName: normalizeSpaces(values.photoName || ""),
  };
}

export function validateRegisterForm(rawValues) {
  const values = normalizeRegisterValues(rawValues);
  const errors = {};

  if (!values.name) {
    errors.name = "El nombre es obligatorio.";
  } else if (values.name.length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres.";
  } else if (!NAME_PATTERN.test(values.name)) {
    errors.name = "El nombre solo puede contener letras y espacios.";
  }

  if (!values.email) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  if (!values.password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  return errors;
}

export function validateLoginForm(rawValues) {
  const values = normalizeLoginValues(rawValues);
  const errors = {};

  if (!values.email) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  if (!values.password) {
    errors.password = "La contraseña es obligatoria.";
  }

  return errors;
}

export function validateCarForm(rawValues) {
  const values = normalizeCarValues(rawValues);
  const errors = {};
  const year = Number(values.year);

  if (!values.brand) {
    errors.brand = "La marca es obligatoria.";
  } else if (!TEXT_PATTERN.test(values.brand)) {
    errors.brand = "La marca solo puede contener letras.";
  }

  if (!values.model) {
    errors.model = "El modelo es obligatorio.";
  } else if (!MODEL_PATTERN.test(values.model)) {
    errors.model = "El modelo solo puede contener letras, números, puntos y guiones.";
  }

  if (!values.year) {
    errors.year = "El año es obligatorio.";
  } else if (!/^\d{4}$/.test(values.year)) {
    errors.year = "El año debe tener 4 dígitos.";
  } else if (Number.isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) {
    errors.year = `El año debe estar entre ${MIN_YEAR} y ${MAX_YEAR}.`;
  }

  if (!values.plateNumber) {
    errors.plateNumber = "La placa es obligatoria.";
  } else if (!PLATE_PATTERN.test(values.plateNumber)) {
    errors.plateNumber =
      "La placa debe contener solo letras, números o guiones, con 4 a 10 caracteres.";
  }

  if (!values.color) {
    errors.color = "El color es obligatorio.";
  } else if (!TEXT_PATTERN.test(values.color)) {
    errors.color = "El color solo puede contener letras.";
  }

  if (!values.photoName) {
    errors.photoName = "El nombre de la foto es obligatorio.";
  } else if (!PHOTO_NAME_PATTERN.test(values.photoName)) {
    errors.photoName =
      "El nombre de la foto solo puede contener letras, números, espacios, puntos, guiones y guiones bajos.";
  }

  return errors;
}

export function getFieldError(errors, fieldName) {
  return errors[fieldName] || "";
}
