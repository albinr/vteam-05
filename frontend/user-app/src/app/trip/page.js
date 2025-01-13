"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

import "./TripPage.css";

const TripPage = () => {

    const [loading, setLoading] = useState(true);
    const [activeTrip, setActiveTrip] = useState(null);

    useEffect(() => {
        async function getTrip() {
            setLoading(true);
            // Fetch user_id from cookies
            const user_id = Cookies.get("user") ? JSON.parse(Cookies.get("user")).id : null;

            // Fetch active trip
            const trips = await apiClient.get(`/trips/active/${user_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                }
            );

            if (trips.length === 0) {
                console.log("No active trip");
                setLoading(false);
                return;
            }

            if (trips.length > 1) {
                console.error("Multiple active trips found");
                setLoading(false);
                return;
            }

            if (trips.message) {
                console.error("Access denied");
                setLoading(false);
                return;
            }

            setActiveTrip(trips[0]);

            console.log("Active trip: ", trips);
            setLoading(false);
        }

        getTrip();
    }, []);

    const handleTripStop = async () => {
        const bike_id = activeTrip.bike_id;

        try {
            let token = Cookies.get("token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trips/end/${bike_id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            console.log(data);

            // Redirect to "/trip"
            window.location.href = "/trip";

        } catch (error) {
            console.error("Error ending trip:", error);
            return error;
        }
    }


    if (loading) {
        return <div id="trip-page">
            <h1>Loading...</h1>
        </div>
    }

    if (!loading && !activeTrip) {
        return <div id="trip-page">
            <h1>No active trip</h1>
        </div>
    }

    if (!loading && activeTrip) {
        return <div id="trip-page">
            <h1>Active Trip</h1>
            <p>{new Date(activeTrip.start_time).toLocaleString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            <button id="trip-stop-btn" onClick={handleTripStop}>STOP</button>
        </div>
    }
};

export default TripPage;