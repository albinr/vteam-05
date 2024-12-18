"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to backend for authentication
        router.push('http://localhost:1337/auth/google');
    }, []);

    return <div>Redirecting to login...</div>;
};

export default Login;