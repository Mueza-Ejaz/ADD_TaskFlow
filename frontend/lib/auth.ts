import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:8000/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: credentials?.email, password: credentials?.password })
        });
        if (!res.ok) return null;
        const data = await res.json();
        // Backend returns { access_token: "...", token_type: "bearer" }
        // We need to get user info separately using the token
        const userRes = await fetch("http://localhost:8000/api/v1/auth/me", {
          headers: {
            "Authorization": `Bearer ${data.access_token}`,
            "Content-Type": "application/json"
          }
        });
        if (!userRes.ok) return null;
        const userData = await userRes.json();

        return {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.full_name,
          accessToken: data.access_token
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};
