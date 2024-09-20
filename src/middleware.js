// app/middleware.js

import { NextResponse } from 'next/server';
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";


export async function middleware(request) {



  // Check for authentication
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: res });

  

  const { data: { session } } = await supabase.auth.getSession();
  
  const isAdmin = session?.user?.user_metadata?.role === 'admin';
  
  const isAuthPage = request.nextUrl.pathname === '/admin/auth/login';

  if (!session && !isAuthPage) {
    // Si l'utilisateur n'est pas connecté et n'accède pas à la page de connexion
    return NextResponse.redirect(new URL('/admin/auth/login', request.url));
  }

  if (session && !isAdmin && !isAuthPage) {
    // Si l'utilisateur est connecté mais n'est pas admin
    return NextResponse.redirect(new URL('/admin/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*',], // Protège toutes les pages sous /admin
};
