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

    // async function monthlyPay(user) {
    //     if (!checkbox) {
    //         return;
    //     }
    //     let userbalance = user.userInfo.balance
    //     const today = new Date();
    //     const month = today.getMonth();
    //     const year = today.getFullYear();
    //     const lastday = new Date(year, month + 1, 0) ;
    //     const paid = localStorage.getItem("paid");
    //     console.log(user)

    //     if (today.getDate() === lastday && !paid) {
    //         if (userbalance > 0) {
    //             const amount = - userbalance;
    //             userbalance = 0
    //             try {
    //                 await apiClient.put(`v3/users/${user.id}`, {
    //                     balance: amount,
    //                 });
    //             } catch (error) {
    //                 console.error("Error adding money:", error.message);
    //                 setBalance(balance);
    //             }
    //             localStorage.setItem("paid", "true")
    //             console.log('added', amount, 'to account')
    //         }
    //     } else if (today.getDate() !== lastday) {
    //         localStorage.removeItem("paid");
    //     }
    // }
    // monthlyPay(user);

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
                    <h3>How it works</h3>
                    <p>You can add money to your balance in advance for faster future payments.</p>
                    <ul>
                        <li>Enter the amount you'd like to add.</li>
                        <li>Click <strong>Submit</strong> to process the transaction.</li>
                        <li>The amount will be added to your current balance.</li>
                        <li>Once you've completed a trip it will deduct the amount from you'r balance</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Balance);