import { signIn, signOut, useSession } from "next-auth/react";
import './Header.css';

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className="header">
            <div>
                <h1 className="header-title">Admin Panel</h1>
            </div>
            {session ? (
                <div>
                    <button
                        className="header-logout"
                        onClick={() => signOut()}
                    >Sign Out</button>
                </div>
            ) : (
                <button
                    className="header-login"
                    onClick={() => signIn("google")}
                >
                    Sign In
                </button>
            )}
        </header>
    );
}
