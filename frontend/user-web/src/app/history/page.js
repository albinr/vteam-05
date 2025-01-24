"use client";

import { useEffect, useState } from "react";
import withAuth from "../hoc/withAuth";
import { apiClient } from "@/services/apiClient";

import "./history.css";

const History = ({ session }) => {
    const [selectedTable, setSelectedTable] = useState("trip");
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tripData, setTripData] = useState([]);
    const [zones, setZones] = useState([]);

    useEffect(() => {
        async function getUser() {
            try {
                const user = await apiClient.get("user/data");
                console.log(user);
                setUser(user);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user:", error.message);
                setIsLoading(false);
            }
        }

        getUser();
    }, [])

    useEffect(()=> {
        if (!user) return;
        async function getTrip() {
            const userTrip = await apiClient.get(`v3/trips/from/${user.id}`);
            setTripData(userTrip);
            console.log(userTrip);
        }
        getTrip();
    }, [user]);

    useEffect(() => {
        async function fetchZones() {
            try {
                const zones = await apiClient.get("v3/zones");
                console.log("Zones:", zones);
                setZones(zones);
            } catch (error) {
                console.error("Error fetching zones:", error.message);
            }
        }

        fetchZones();
    }, []);

    function isClose(lat1, lon1, lon2, lat2) {
        const closelat = Math.abs(lat1 - lat2) <= 0.001;
        const closelon = Math.abs(lon2 - lon1) <= 0.001;
        console.log(closelat, closelon)
        return closelat && closelon;
    }

    const processedTripData = tripData.map((trip) => {
        const [startLat, startLon] = trip.start_position.split(" ").map(Number);
        const [endLat, endLon] = trip.end_position.split(" ").map(Number);

        const startZone = zones.find((zone) =>
            isClose(startLat, startLon, zone.latitude, zone.longitude)
        );

        const endZone = zones.find((zone) =>
            isClose(endLat, endLon, zone.latitude, zone.longitude)
        );

        return {
            ...trip,
            startZoneName: startZone ? startZone.name : "not parked inside zone",
            endZoneName: endZone ? endZone.name : "not parked inside zone",
        };
    });


    const time = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    return (
        <div className="outer-box">
            <h2>Travel History</h2>
            <div className="table-container">
                {selectedTable === "trip" ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Start Location</th>
                                <th>End Location</th>
                                <th>Duration</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedTripData.length > 0 ? (
                                processedTripData.map((trip, index) => (
                                    <tr key={index}>
                                        <td>{time(trip.start_time)}</td>
                                        <td>{trip.startZoneName}</td>
                                        <td>{trip.endZoneName}</td>
                                        <td>{trip.duration_minutes} minutes</td>
                                        <td>{trip.price}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No trips available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                )}
            </div>
        </div>
    );
};

export default withAuth(History);