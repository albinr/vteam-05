"use client";

import "./Button.css";

const Button = ({ label, onClick, href, className = "", disabled = false, type = "button", ...props }) => {
    const Element = href ? "a" : "button";
    return (
        <Element
            href={href}
            type={href ? undefined : type}
            onClick={href ? undefined : onClick}
            className={`button ${className}`}
            disabled={disabled}
            {...props}
        >
            {label}
        </Element>
    );
};

export default Button;
