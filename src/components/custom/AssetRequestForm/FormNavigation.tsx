import React from "react";
import { Button } from "@/components/ui/button";
import { FormNavigationProps } from "./types";

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  stepsCount,
  isFirstStep,
  isLastStep,
  goToPreviousStep,
  goToNextStep,
  isSubmitting,
  isStepValid,
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        onClick={goToPreviousStep}
        disabled={isFirstStep}
        className={`bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 ${
          isFirstStep ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Previous
      </Button>
      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
        Step {currentStep + 1} of {stepsCount}
      </div>
      {!isLastStep ? (
        <Button
          type="button"
          onClick={goToNextStep}
          disabled={!isStepValid()}
          className={`bg-blue-600 text-white hover:bg-blue-700 ${
            !isStepValid() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </Button>
      ) : (
        <Button
          type="button"
          onClick={goToNextStep}
          disabled={isSubmitting || !isStepValid()}
          className={`bg-blue-600 text-white hover:bg-blue-700 ${
            isSubmitting || !isStepValid() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      )}
    </div>
  );
};
