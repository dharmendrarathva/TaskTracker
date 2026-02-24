

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/config/db";

const handler = async (req: any, res: any) => {
  await connectDB(); 
  return NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };