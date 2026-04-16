export function getErrorMessage(error, fallback = "Something went wrong.") {
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
    return "Unable to connect to the backend. Check that the API is running.";
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
}
