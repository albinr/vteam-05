"use client";

import { useEffect } from "react";
import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

const TripPage = () => {

    useEffect(() => {
        async function getTrip() {
            // Fetch user_id from cookies
            const user_id = Cookies.get("user") ? JSON.parse(Cookies.get("user")).id : null;

            // Fetch active trip
            const trips = await apiClient.get(`/users/${user_id}/trips`);

            if (trips.length === 0) {
                console.log("No active trip");
                return;
            }

            if (trips.length > 1) {
                console.error("Multiple active trips found");
                return;
            }

            console.log("Active trip: ", trips);
        }

        getTrip();
    }, []);

    return <>
        <h1>Active Trip</h1>
    </>;
};

export default TripPage;