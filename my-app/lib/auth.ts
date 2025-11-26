import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credential from "next-auth/providers/credentials"
import { SKIT_DOMAIN, TPO_EMAIL, TPO_PASSWORD } from "../constants";
 
export const { handlers, auth, signIn, signOut} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credential({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.email === TPO_EMAIL && credentials?.password === TPO_PASSWORD){
          return {
            id: "tpo-id-1",
            email: TPO_EMAIL,
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return !!(profile?.email && profile.email.endsWith(SKIT_DOMAIN));
      }
      return true; 
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id ?? "student"
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, 
  },
})