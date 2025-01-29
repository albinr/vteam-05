import { apiClient } from "@/services/apiClient";

// Planned api fetches

// Fetch all zones
export const fetchZones = async () => {
    return apiClient.get("/zones");
};

// Fetch a zone by id
export const fetchZoneById = async (id) => {
    return apiClient.get(`/zones/${id}`);
};

export const deleteZoneById = async (id) => {
    return apiClient.delete(`/zones/one/${id}`);
};

export const createZone = async (data) => {
    return apiClient.post("/zones/add", data);
};

export const updateZone = async (id, data) => {
    return apiClient.put(`/zones/${id}`, data);
};