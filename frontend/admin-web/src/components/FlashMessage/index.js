import React, { useEffect, useState } from "react";
import "./FlashMessage.css";

const FlashMessage = ({ message, type = "info", duration = 3000, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isHiding, setIsHiding] = useState(false); // New state for hiding animation

    useEffect(() => {
        const showTimer = setTimeout(() => {
            setIsHiding(true); // Start "roll up" animation
            setTimeout(() => {
                setIsVisible(false); // Remove from DOM after animation
                if (onDismiss) onDismiss();
            }, 300); // Match the duration of the "roll up" animation
        }, duration);

        return () => clearTimeout(showTimer);
    }, [duration, onDismiss]);

    if (!isVisible) return null;

    return (
        <div className={`flash-message ${isHiding ? "hide" : ""} ${type}`}>
            <span>{message}</span>
            <button
                onClick={() => {
                    setIsHiding(true); // Start "roll up" animation
                    setTimeout(() => {
                        setIsVisible(false); // Remove from DOM after animation
                        if (onDismiss) onDismiss();
                    }, 300); // Match the duration of the "roll up" animation
                }}
            >
                &times;
            </button>
        </div>
    );
};

export default FlashMessage;
