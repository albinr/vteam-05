import { apiClient } from "@/services/apiClient";

// Planned api fetches

// Fetch all users
export const fetchUsers = async () => {
    return apiClient.get("/users");
};

// Fetch a user by id
export const fetchUserById = async (id) => {
    return apiClient.get(`/users/${id}`);
};

// Fetch user trips by id
export const fetchUserTripsById = async (id) => {
    return apiClient.get(`/users/${id}/trips`);
};

// Fetch user payments by id
export const fetchUserPaymentsById = async (id) => {
    return apiClient.get(`/users/${id}/payments`);
};

// Delete user by id
export const deleteUserById = async (id) => {
    return apiClient.delete(`/users/${id}`);
};

// Create user
export const createUser = async (userData) => {
    return apiClient.post("/users", userData);
};

// Update user by id
export const updateUser = async (bikeData) => {
    return apiClient.put("/users", bikeData)
}

