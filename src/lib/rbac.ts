import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!session.user.isActive) {
    throw new Error("Account disabled");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "admin") {
    throw new Error("Forbidden");
  }

  return session;
}