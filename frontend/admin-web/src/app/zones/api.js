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

