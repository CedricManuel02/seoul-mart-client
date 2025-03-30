import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/orders", "/product", "/product/create", "/product/update", "/categories", "/dashboard"];

const publicRoutes = ["/", "/login", "/register", "/products", "/policy"];


export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const { pathname } = request.nextUrl;
  
  if (!token && (pathname.startsWith("/purchase/item") || pathname.startsWith("/purchase"))) {
    return NextResponse.redirect(new URL("/", request.url)); 
  }

  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url)); 
  }

  if(!token && (pathname === "/profile" || pathname === "/reset-profile-password" )) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if(token) {
    if(token.role === "ADMIN" && publicRoutes.includes(pathname)){
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if(token.role === "USER" && protectedRoutes.includes(pathname)){
      return NextResponse.redirect(new URL("/", request.url));
    }
  } 

  return NextResponse.next();
}
