"use client";

import "./UsersWidget.css";

export default function UsersWidget({ users }) {
    return (
        <div className="users-widget">
            <h2>Recent Logins</h2>
            <ul>
                {users
                    .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
                    .map((user) => (
                        <li key={user.id}>
                            <p>{user.name}</p>
                            <span>{new Date(user.lastLogin).toLocaleString()}</span>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
