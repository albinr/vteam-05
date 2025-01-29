"use client";

import { useEffect, useState } from "react";
import withAuth from "../hoc/withAuth";
import { apiClient } from "@/services/apiClient";
import "./balance.css";

const Balance = ({ session }) => {
    const [balance, setBalance] = useState(0);
    const [addAmount, setAddAmount] = useState("");
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [amountToPay, setAmountToPay] = useState(0);

    useEffect(() => {
        async function getUser() {
            try {
                const user = await apiClient.get("user/data");
                // console.log(user);
                setUser(user);
                setBalance(user.userInfo.balance);
                if (user.userInfo.balance < 0) {
                    setAmountToPay(-user.userInfo.balance);
                } else {
                    setAmountToPay(0);
                }
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
        if (newBalance < 0) {
            setAmountToPay(-newBalance);
        } else {
            setAmountToPay(0);
        }

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
            <h1>Payment Method</h1>
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
                    <h3>How it works</h3>
                    <p>You can add money to you&apos;r balance in advance for faster future payments.</p>
                    <ul className="right-box-text">
                        <p>Enter the amount you like to add.</p>
                        <p>Click <strong>Submit</strong> to process the transaction.</p>
                        <p>The amount will be added to your current balance.</p>
                        <p>Once you&apos;ve completed a trip it will deduct the amount from your balance</p>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Balance);