import { NextRequest, NextFetchEvent } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

// Middleware Clerk
export default function myClerkMiddleware(req: NextRequest, ev: NextFetchEvent) {
  if (!process.env.CLERK_SECRET_KEY) {
    console.error("CLERK_SECRET_KEY não definida. Verifique as variáveis de ambiente.");
    return new Response("Erro de configuração de Clerk", { status: 500 });
  }
  return clerkMiddleware()(req, ev);
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
