"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to backend for authentication
        router.push(`${process.env.NEXT_PUBLIC_API_AUTH_URL}/admin-web/google`);
    }, []);

    return <div>Redirecting to login...</div>;
};

export default Login;