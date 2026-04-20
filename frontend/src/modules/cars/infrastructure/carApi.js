import apiClient from "../../../shared/http/apiClient";

const carApi = {
  async getCars() {
    const response = await apiClient.get("/cars");
    return response.data;
  },

  async getCarById(id) {
    const response = await apiClient.get(`/cars/${id}`);
    return response.data;
  },

  async createCar(data) {
    const response = await apiClient.post("/cars", data);
    return response.data;
  },

  async updateCar(id, data) {
    const response = await apiClient.put(`/cars/${id}`, data);
    return response.data;
  },

  async deleteCar(id) {
    const response = await apiClient.delete(`/cars/${id}`);
    return response.data;
  },
};

export default carApi;
