import { API_ENDPOINT } from "@/_constant/constant";
import { sign } from "jsonwebtoken";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    role?: string;
    token?: string;
    phone?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      image?: string;
      role?: string;
    };
    token?: string;
  }
}

export async function getRefreshToken({ token }: { token: string }) {
  try {
    const response = await fetch(`${API_ENDPOINT}/auth/account`, {
      method: "GET",
      headers: {
        Cookie: `auth__token=${token}`,
      },
    });

    const data = await response.json();

    return { user: data.data, token: data.token.session_token };
  } catch (error) {
    console.error("Something went wrong while refreshing your token:", error);
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
          const response = await fetch(`${API_ENDPOINT}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_email: credentials.email, user_password: credentials.password }),
          });

          const data = await response.json();
          if (response.ok && data.data) {
            return {
              id: data.data.user_id,
              name: data.data.user_name,
              email: data.data.user_email,
              image: data.data.user_profile,
              phone: data.data.user_phone,
              role: data.data.roles,
              token: data.token,
            };
          }
          return null;

      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.image = user.image;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.token) {
        const data = await getRefreshToken({ token: token.token as string });
        if (data?.token) {
          token.token = data.token;
          session.token = data.token;
        }
      }

      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.user.image = token.image;
      session.user.role = token.role;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // Session max age (1 day)
  },
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET, // Ensure this is set in your environment variables
});
