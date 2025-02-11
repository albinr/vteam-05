"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";
import Loader from "@/components/Loader";

import "./HistoryPage.css";

const HistoryPage = () => {
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState(null);

    useEffect(() => {
        async function getTrips() {
            setLoading(true);
            // Fetch user_id from cookies
            const user_id = Cookies.get("user") ? JSON.parse(Cookies.get("user")).id : null;

            // Fetch active trip
            const trips = await apiClient.get(`/v3/trips/from/${user_id}`,);

            if (trips.length === 0) {
                console.log("No previous trips");
                setLoading(false);
                return;
            }

            if (trips.message) {
                console.error("Access denied");
                setLoading(false);
                return;
            }

            // Order trips based on start date
            trips.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

            setTrips(trips);

            setLoading(false);
        }

        getTrips();
    }, []);


    if (loading) {
        return <div id="history-page">
            <h1>Previous Trips</h1>
            <Loader />
        </div>
    }

    if (!loading && !trips) {
        return <div id="history-page">
            <h1>Previous Trips</h1>
            <p className="history-no-trips-text">No previous trips</p>
        </div>
    }

    if (!loading && trips) {
        return <div id="history-page">
            <h1>Previous Trips</h1>
            {trips.map((trip, index) => {
                return <div key={index} className="trip">
                    <h2>Trip ID_{trip.trip_id}</h2>
                    <p>
                        {
                            new Date(trip.start_time).toLocaleString("en-US", { weekday: 'long' })
                            + " " +
                            new Date(trip.start_time).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
                            + " - " +
                            new Date(trip.end_time).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
                            + " (" + trip.duration_minutes + " minutes)"
                        }
                    </p>
                    <p className="history-trip-price">{trip.price}</p>
                    <p className="history-trip-distance">{trip.distance}</p>
                </div>
                }
            )}
        </div>
    }
};

export default HistoryPage;