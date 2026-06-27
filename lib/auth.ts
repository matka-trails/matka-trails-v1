import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

// On Vercel, NEXTAUTH_URL may not be set — detect production via VERCEL_URL
const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://") ||
  !!process.env.VERCEL_URL;
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = process.env.NEXTAUTH_URL
  ? new URL(process.env.NEXTAUTH_URL).hostname
  : process.env.VERCEL_URL || "localhost";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!admin) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          admin.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Return user object — this gets passed to the jwt callback
        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: hostName === "localhost" ? undefined : hostName,
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist custom fields into the JWT
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose custom fields in the session object for client-side use
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Allow NextAuth to work without NEXTAUTH_URL on Vercel
  ...(process.env.VERCEL_URL && !process.env.NEXTAUTH_URL
    ? { trustHost: true }
    : {}),
};

