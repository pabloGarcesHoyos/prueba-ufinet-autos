export function getErrorMessage(error, fallback = "Ocurrio un error inesperado.") {
  const validationErrors = error.response?.data?.validationErrors;

  if (validationErrors && typeof validationErrors === "object") {
    const messages = Object.values(validationErrors).filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message === "Network Error") {
    return "No fue posible conectarse con el backend. Verifica que la API este en ejecucion.";
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
}
