import { User } from "@/models/User";

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId).select("-providerId");

  if (!user) throw new Error("User not found");

  return user;
}

export async function getAllUsers() {
  return User.find().select("-providerId");
}

export async function deactivateUser(userId: string) {
  return User.findByIdAndUpdate(userId, { isActive: false });
}