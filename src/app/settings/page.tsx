"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const user = session?.user;

  // 🔐 Protect page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-4">Settings</h1>
          <p className="text-gray-400">
            Manage your account preferences and profile information.
          </p>
        </section>

        {/* Profile Section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-6 text-amber-400">
            Profile Information
          </h2>

          <div className="flex flex-col md:flex-row md:items-center gap-8">

            {/* Avatar */}
            <div className="flex items-center gap-6">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="profile"
                  width={100}
                  height={100}
                  className="rounded-full border border-white/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <div className="mt-2 bg-black border border-white/10 p-3 rounded-lg">
                  {user?.name}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Email Address</label>
                <div className="mt-2 bg-black border border-white/10 p-3 rounded-lg">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-6 text-amber-400">
            Preferences
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span>Email Notifications</span>
              <input type="checkbox" className="w-5 h-5 accent-amber-400" />
            </div>

            <div className="flex justify-between items-center">
              <span>Weekly Productivity Report</span>
              <input type="checkbox" className="w-5 h-5 accent-amber-400" />
            </div>

            <div className="flex justify-between items-center">
              <span>Dark Mode</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 accent-amber-400"
              />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 backdrop-blur-md mb-20">
          <h2 className="text-xl font-semibold mb-4 text-red-400">
            Danger Zone
          </h2>

          <p className="text-gray-400 mb-6">
            Logging out will end your current session on this device.
          </p>

          <button
            onClick={() => setIsConfirmOpen(true)}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition font-medium"
          >
            Delete  Account
          </button>
        </section>

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Delete Confirmation"
          message="Are you sure you want to Delete  your account?"
          confirmText="Yes, Delete"
          cancelText="Cancel"
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            setIsConfirmOpen(false);
            signOut({ callbackUrl: "/" });
          }}
        />

      </div>
    </div>
  );
}