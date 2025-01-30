"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";
import Loader from "@/components/Loader";

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
            const trips = await apiClient.get(`/v3/trips/active/${user_id}`);

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

            // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v3/trips/end/${bike_id}`, {
            //     method: "POST",
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // });

            await apiClient.post(`/v3/trips/end/${bike_id}`);

            // Redirect to "/trip"
            window.location.href = "/history";

        } catch (error) {
            console.error("Error ending trip:", error);
            return error;
        }
    }


    if (loading) {
        return <div id="trip-page">
            <h1>Active Trip</h1>
            <Loader />
        </div>
    }

    if (!loading && !activeTrip) {
        return <div id="trip-page">
            <h1>Active trip</h1>
            <p className="trip-no-trip-text">No active trip</p>
        </div>
    }

    if (!loading && activeTrip) {
        return <div id="trip-page">
            <h1>Active Trip</h1>
            <p id="trip-start-date">{new Date(activeTrip.start_time).toLocaleString("en-US", { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            <button id="trip-stop-btn" onClick={handleTripStop}>STOP</button>
            <p id="trip-trip-id">ID_{activeTrip.trip_id}</p>
        </div>
    }
};

export default TripPage;