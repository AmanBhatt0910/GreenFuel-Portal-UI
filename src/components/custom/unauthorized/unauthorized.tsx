"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock } from "lucide-react";

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(3);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleRedirect = () => {
    setIsRedirecting(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isRedirecting) {
      router.push("/dashboard");
    }
  }, [isRedirecting, router]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center border-t-4 border-red-500">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Unauthorized Access
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You don&apos;t have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </p>

        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
            <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
            <p className="text-gray-700 dark:text-gray-300">
              Redirecting in{" "}
              <span className="font-bold text-red-600 dark:text-red-400">
                {countdown}
              </span>{" "}
              seconds
            </p>
          </div>
        </div>

        <button
          onClick={handleRedirect}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
          disabled={isRedirecting}
        >
          {isRedirecting ? "Redirecting..." : "Return to Dashboard"}
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
