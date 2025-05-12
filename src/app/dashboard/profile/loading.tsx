import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          Loading Profile...
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Please wait while we fetch your profile information.
        </p>
      </div>
    </div>
  );
};

export default Loading;