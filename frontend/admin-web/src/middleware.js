import { NextResponse } from 'next/server';

export function middleware(request) {
    // Get JWT Token
    const token = request.cookies.get("token");

    if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/bikes',
        '/users',
        '/zones',
    ],  // Apply to specific routes
};