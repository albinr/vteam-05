"use client";

import { useEffect, useState } from "react";
import withAuth from "../hoc/withAuth";
import { apiClient } from "@/services/apiClient";
import "./balance.css";
import Button from "../../components/Button";

const Balance = ({ session }) => {
    const [balance, setBalance] = useState(0);
    const [addAmount, setAddAmount] = useState("");
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            try {
                const user = await apiClient.get("user/data");
                console.log(user);
                setUser(user);
                setBalance(user.userInfo.balance);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user:", error.message);
                setIsLoading(false);
            }
        }

        getUser();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    async function handleAddMoney() {
        const amount = parseFloat(addAmount);
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        const newBalance = balance + amount;

        setBalance(newBalance);
        setAddAmount("");

        try {
            await apiClient.put(`v3/users/${user.id}`, {
                balance: newBalance,
            });
        } catch (error) {
            console.error("Error adding money:", error.message);
            setBalance(balance);
        }
    };

    return (
        <div className="outer-box">
            <h1>Payment Methods</h1>
            <h3>Current Balance</h3>
            <div className="balance-box">
                <h2>{balance}kr</h2>
            </div>
            <div className="inner-box">
                <div className="left-box">
                    <h2>Add money</h2>
                    <div>
                        <input
                            className="input"
                            type="number"
                            placeholder="Enter amount to add"
                            min="1"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                        />
                    </div>
                    <button className="submit" onClick={handleAddMoney}>
                        Submit
                    </button>
                </div>
                <div className="right-box">
                    <h2>Monthly pay</h2>
                    <div className="money-box">
                        <h2>Add 300kr monthly</h2>
                    </div>
                    <Button
                        className="big-button"
                        href="/balance"
                        label={<h2>Add Balance</h2>}
                    />
                </div>
            </div>
        </div>
    );
};

export default withAuth(Balance);