"use client";

import React from "react";
import { FaLocationDot, FaSquareArrowUpRight, FaBell } from "react-icons/fa6";

import "./Navigation.css";

export default function Navigation() {

    return (
        <nav className="bottom-nav">
            <ul>
                <li>
                    <a href="/map"><FaLocationDot /></a>
                </li>
                <li>
                    <a href="/trip"><FaSquareArrowUpRight /></a>
                </li>
                <li>
                    <a href="/history"><FaBell /></a>
                </li>
            </ul>
        </nav>
    );
}
