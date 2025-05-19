import React from "react";
import { Check, Leaf } from "lucide-react";

interface SidebarItemProps {
  step: {
    id: number;
    title: string;
    description: string;
    icon: string;
  };
  index: number;
  currentStep: number;
  onClick: (step: number) => void;
  completed: boolean;
  className?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  step,
  index,
  currentStep,
  onClick,
  className = "",
}) => {
  const isActive = currentStep === index;
  const isCompleted = currentStep > index;

  return (
    <div
      className={`flex items-center space-x-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500"
          : isCompleted
          ? "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-green-500"
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      } ${className}`}
      onClick={() => {
        // Only allow navigation to completed steps or current step
        if (currentStep >= index) {
          onClick(index);
        }
      }}
    >
      <div
        className={`relative flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all duration-300 ${
          isActive
            ? "bg-green-500 text-white"
            : isCompleted
            ? "bg-green-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
      >
        {isActive && (
          <span className="absolute w-full h-full rounded-full bg-green-400/50 animate-ping opacity-50"></span>
        )}
        {isCompleted ? (
          <Check className="w-4 h-4" />
        ) : (
          <span>{index + 1}</span>
        )}
      </div>
      <div>
        <div
          className={`text-sm font-medium ${
            isActive
              ? "text-green-700 dark:text-green-400"
              : isCompleted
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {step.title}
          {isCompleted && (
            <div className="text-xs text-green-600 dark:text-green-400 opacity-80 flex items-center">
              <Leaf className="w-3 h-3 mr-1" /> Step completed
            </div>
          )}
        </div>
        {isActive && (
          <div className="text-xs text-green-600 dark:text-amber-300 opacity-90">
            {step.description}
          </div>
        )}
      </div>
    </div>
  );
};
