import Link from "next/link";
import "./not-found.css";

export default function NotFound() {
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-text">Oops! The page you are looking for does not exist.</p>
            <Link href="/" className="not-found-link">
                Go back to the homepage
            </Link>
        </div>
    );
}
