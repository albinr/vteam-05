import { apiClient } from "@/services/apiClient";

// Api fetches

// Fetch all bikes
export const fetchBikes = async () => {
    return apiClient.get("/bikes");
};

// Fetch bike by id
export const fetchBikeById = async (id) => {
    return apiClient.get(`/bikes/${id}`);
};

// Delete bike by id
export const deleteBikeById = async (id) => {
    return apiClient.delete(`/bikes/${id}`);
};

// Create bike
export const createBike = async (bikeData) => {
    return apiClient.post("/bikes", bikeData);
};

// Update bike by id??
export const updateBike = async (bikeData) => {
    return apiClient.put("/bikes", bikeData)
}

// Fetch bike tips by id
export const fetchTripsByBikeId = async (id) => {
    return apiClient.get(`/trips/${id}`);
};

// Current api fetches
// export const fetchBikes = async () => {
//     return apiClient.get("/bikes");
// };

// export const fetchBikeById = async (id) => {
//     return apiClient.get(`/bikes/${id}`);
// };