import type { NextAuthConfig } from 'next-auth';
import type { DefaultSession } from 'next-auth';
import type { Session, User } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      image: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
  }
}

import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          image: token.image
        };
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth;
      const protectedPaths = ['/dashboard'];
      const isProtectedRoute = protectedPaths.some(path => nextUrl.pathname.startsWith(path));
      if (isProtectedRoute && !isLoggedIn) return false;

      return true;
    },
  },
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig;