"use client";

import "./StatsWidget.css";

export default function StatsWidget({ stats }) {
    return (
        <div className="stats-widget">
            <h2>System Stats</h2>
            <div className="stats-cards">
                <div className="stats-card">
                    <h3>Bikes</h3>
                    <p>{stats.bikes}</p>
                </div>
                <div className="stats-card">
                    <h3>Users</h3>
                    <p>{stats.users}</p>
                </div>
                <div className="stats-card">
                    <h3>Active Users</h3>
                    <p>{stats.activeUsers}</p>
                </div>
            </div>
        </div>
    );
}
