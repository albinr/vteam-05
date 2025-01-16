"use client";

import { useState } from "react";
import withAuth from "../hoc/withAuth";
import { apiClient } from "@/services/apiClient";
import "./balance.css"
import Button from "../../components/Button";


const Balance = ({ session }) => {
    const [balance, newBalance] = useState(100);
    const [Add, AmountToAdd] = useState("");

    const handleAddMoney = () => {
        const amount = parseFloat(Add);

        newBalance((prevBalance) => prevBalance + amount);
        AmountToAdd("");
    };

    return (
        <div className="outer-box">
            <div className="balance-box">
                <h2>{balance}kr</h2>
                <p>Current Balance</p>
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
                            value={Add}
                            onChange={(e) => AmountToAdd(e.target.value)}
                        />
                    </div>
                    <button className="submit" onClick={handleAddMoney}>Submit</button>
                </div>
                <div className="right-box">
                    <h2>Monthly pay</h2>
                    <div className="money-box">
                        <h2>Add 300kr monthly</h2>
                        <p></p>
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