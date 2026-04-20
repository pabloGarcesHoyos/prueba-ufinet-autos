import apiClient from "../../../shared/http/apiClient";

const authApi = {
  async register(data) {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  async login(data) {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },
};

export default authApi;
