import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
  authRoutes,
} from './routes';

const auth = NextAuth(authConfig);
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextAuthRequest, NextAuthResponse } from 'next-auth';
import { NextApiHandler } from 'next';
import { NextAuthOptions } from 'next-auth';
import type { Session } from 'next-auth';

export const authHandler = async (
  req: NextAuthRequest,
  res: NextAuthResponse
) => {
  const session = await getServerSession(req as any, res as any, authConfig);
  if (!session || !session.user) {
    return res.status(401).end();
  }

  const nextUrl = new URL(req.url || '');
  const isApiAuthRoute = nextUrl?.pathname?.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isLoggedIn = !!session;

  if (isApiAuthRoute || !nextUrl?.pathname) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !publicRoutes.includes(nextUrl.pathname || '')) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!.+".[\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

export default authHandler as NextApiHandler;