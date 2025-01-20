"use client";

import withAuth from "../hoc/withAuth";
import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import "./account.css"
import Button from "../../components/Button";



const Account = ({ session }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="outer-box">
            <h1>Account Management</h1>
            <div className="inner-box">
                <div className="left-box"><h2>Account Information</h2>
                    <h3>Full Name</h3>
                    <div className="email-box">
                        <h2>{user.name}</h2>
                    </div>
                    <h3>Email</h3>
                    <div className="email-box">
                        <h2>{user.email}</h2>
                    </div>
                </div>
                <div className="right-box"><h2>Account Balance</h2>
                    <h3>Current Balance</h3>
                    <div className="money-box">
                        <h2>{user.userInfo.balance}kr</h2>
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