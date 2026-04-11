"use client";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Profile = {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
};

type Props = {
  profile: Profile | null;
  email: string;
};

const DashboardTab = ({ profile, email }: Props) => {
  const router = useRouter();
  const fullName =
    profile?.first_name || profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : "there";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/signin");
    } catch {
      toast.error("Failed to log out.");
    }
  };

  return (
    <p className="text-dark">
      Hello {fullName} (not {fullName}?{" "}
      <button
        onClick={handleLogout}
        className="text-red ease-out duration-200 hover:underline"
      >
        Log Out
      </button>
      )
      <span className="block text-custom-sm mt-4 text-dark">
        {email && (
          <>
            Signed in as <strong>{email}</strong>
          </>
        )}
      </span>
      <span className="block text-custom-sm mt-4 text-dark">
        From your account dashboard you can view your recent orders, manage your
        shipping and billing addresses, and edit your password and account
        details.
      </span>
    </p>
  );
};

export default DashboardTab;
