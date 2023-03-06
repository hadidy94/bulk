import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import ApiClient from '../../../helpers/ApiClient';

export const authOptions = {
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const email = credentials.email;
        const password = credentials.password;
        const user = await ApiClient.post(`${process.env.API_URL}/api/auth/login`, { email , password });   
                
        if (user) {
          return user
        } else {
          return null
        }

      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.payload.token
        token.user = user.payload.user
      }
      return token
    },
    async session({ session, token}) {
      session.accessToken = token.accessToken
      session.user = token.user
      return session
    }
  },
  secret: process.env.JWT_SECRET,
}

export default NextAuth(authOptions)