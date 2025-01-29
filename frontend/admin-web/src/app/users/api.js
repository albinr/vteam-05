import { apiClient } from "@/services/apiClient";

// Planned api fetches

// Fetch all users
export const fetchUsers = async () => {
    return apiClient.get("/users");
};

// Fetch a user by id
export const fetchUserById = async (id) => {
    return apiClient.get(`/users/one/${id}`);
};

// Fetch user trips by id
export const fetchUserTripsById = async (id) => {
    return apiClient.get(`/trips/from/${id}`);
};

// Fetch user payments by id
export const fetchUserPaymentsById = async (id) => {
    return apiClient.get(`/users/${id}/payments`);
};

// Delete user by id
export const deleteUserById = async (id) => {
    return apiClient.delete(`/users/one/${id}`);
};

// Create user
export const createUser = async (userData) => {
    return apiClient.post("/users", userData);
};

// Update user by id
export const updateUser = async (id, newData) => {
    return apiClient.put(`/users/${id}`, newData)
}

// Update user role by id
export const promoteUserToAdmin = async (id) => {
    return apiClient.put(`/users/admin/${id}`);
};

