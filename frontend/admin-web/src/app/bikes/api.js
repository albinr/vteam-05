import { apiClient } from "@/services/apiClient";

export const fetchBikes = async () => {
    return apiClient.get("/bikes");
};

export const fetchBikeById = async (id) => {
    return apiClient.get(`/bikes/${id}`);
};

export const createBike = async (bikeData) => {
    return apiClient.post("/bikes", bikeData);
};
