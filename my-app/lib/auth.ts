import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { SKIT_DOMAIN, TPO_EMAILS } from "../constants";

 
export const { handlers, auth, signIn, signOut} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return !!(profile?.email && profile.email.endsWith(SKIT_DOMAIN));
      }
      return false
    }
  },
})