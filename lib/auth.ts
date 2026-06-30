import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        try {
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email.toLowerCase().trim(),
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.error?.message || "Invalid email or password");
          }

          // Return user object along with the token
          return {
            id: data.data.admin.id,
            name: data.data.admin.name,
            email: data.data.admin.email,
            role: data.data.admin.role,
            token: data.data.token, // Store the JWT token issued by Express
          };
        } catch (error: any) {
          console.error("[NextAuth Auth Error]", error);
          throw new Error(error.message || "Failed to connect to authentication server");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = (user as any).token; // Store token on JWT token
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session as any).accessToken = token.accessToken; // Expose token to frontend session
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  ...(process.env.VERCEL_URL ? { trustHost: true } : {}),
};
