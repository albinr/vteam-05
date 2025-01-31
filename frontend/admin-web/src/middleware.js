import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get("token");

    if (!token) {
        console.error("No token in cookies!!")
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    console.log("Cookie token success:", token)

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/bikes',
        '/users',
        '/zones',
    ],
};