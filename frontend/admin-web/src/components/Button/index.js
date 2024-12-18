"use client";

import "./Button.css";

const Button = ({ label, onClick, className = "", disabled = false, type = "button" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`button ${className}`}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default Button;
