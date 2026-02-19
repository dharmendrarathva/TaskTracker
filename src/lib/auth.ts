import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/config/db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ profile }) {
      await connectDB();

      const existingUser = await User.findOne({
        providerId: profile?.sub,
      });

      if (!existingUser) {
        await User.create({
          name: profile?.name,
          email: profile?.email,
          image: profile?.image,
          providerId: profile?.sub,
        });
      }

      return true;
    },

    async jwt({ token }) {
      await connectDB();

      const dbUser = await User.findOne({ email: token.email });

      if (dbUser) {
        token.role = dbUser.role;
        token.id = dbUser._id.toString();
        token.isActive = dbUser.isActive;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "admin" | "user";
      session.user.isActive = token.isActive as boolean;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};