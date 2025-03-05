"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GFContext } from "@/context/AuthContext";
import { LoaderCircle } from "lucide-react";

export default function HomePage() {
  const { authToken } = useContext(GFContext);
  const router = useRouter();

  useEffect(() => {
    if (authToken) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [authToken, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="animate-pulse flex flex-col items-center justify-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-green-600 dark:text-green-500" />
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Redirecting...
        </p>
      </div>
    </div>
  );
}
