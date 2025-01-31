import React, { useEffect, useState } from "react";
import "./FlashMessage.css";

const FlashMessage = ({ message, type = "info", duration = 3000, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => {
            setIsHiding(true);
            setTimeout(() => {
                setIsVisible(false);
                if (onDismiss) onDismiss();
            }, 300);
        }, duration);

        return () => clearTimeout(showTimer);
    }, [duration, onDismiss]);

    if (!isVisible) return null;

    return (
        <div className={`flash-message ${isHiding ? "hide" : ""} ${type}`}>
            <span>{message}</span>
            <button
                onClick={() => {
                    setIsHiding(true);
                    setTimeout(() => {
                        setIsVisible(false);
                        if (onDismiss) onDismiss();
                    }, 300);
                }}
            >
                &times;
            </button>
        </div>
    );
};

export default FlashMessage;
