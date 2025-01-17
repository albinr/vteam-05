"use client";

import { useEffect, useState } from "react";
import withAuth from "../hoc/withAuth";
import { apiClient } from "@/services/apiClient";

import "./history.css";

const History = ({ session }) => {
    const [selectedTable, setSelectedTable] = useState("trip");
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            try {
                const user = await apiClient.get("/user/data");
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

    async function getTrip() {
        const userTrip = await apiClient.get(`/trips/from/${user.id}`);
        console.log(userTrip);
    }
    getTrip();

    const handleClick = (tableType) => {
        setSelectedTable(tableType);
    };

    return (
        <div className="outer-box">
            <h2>Travel and Payment History</h2>
            <div className="inner-box">
                <button className="button-history" onClick={() => handleClick("trip")}>Trip History</button>
                <button className="button-history" onClick={() => handleClick("balance")}>Payment History</button>
            </div>

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