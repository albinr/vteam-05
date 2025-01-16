"use client";

import { useState } from "react";
import withAuth from "../hoc/withAuth";
import { apiClient } from "@/services/apiClient";

import "./history.css";

const History = ({ session }) => {
    const [selectedTable, setSelectedTable] = useState("trip");

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