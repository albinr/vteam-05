"use client";

import withAuth from "../hoc/withAuth";
import { apiClient } from "@/services/apiClient";
import "./account.css"
import Button from "../../components/Button";

const showBikes = async () => {
    try {
        const bikes = await apiClient.get("/users/data");
        console.log("Fetched:", bikes);
    } catch (error) {
        console.error("Error fetching bikes:", error.message);
    }
};

showBikes();

const Account = ({ session }) => {

    return (
        <div className="outer-box">
            <h1>Account Management</h1>
            <div className="inner-box">
                <div className="left-box"><h2>Account Information</h2>
                    <div className="email-box">
                        <h2>Test1@gmail.com</h2>
                    </div>
                </div>
                <div className="right-box"><h2>Account Balance</h2>
                    <div className="money-box">
                        <h2>100kr</h2>
                        <p>Current Balance</p>
                    </div>
                    <Button className="big-button"
                    href="/balance"
                    label={<h2>Add Balance</h2>}
                    />
                </div>
            </div>
        </div>
    );
};

export default withAuth(Account);