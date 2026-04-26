import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_ROUTES = ["/dashboard", "/profile", "/settings"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("token")?.value;

    const isPrivate = PRIVATE_ROUTES.some((route) =>
        pathname.startsWith(route)
    
    );

    if (isPrivate && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }



    return NextResponse.next();
}