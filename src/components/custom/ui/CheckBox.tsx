import React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface GreenFuelCheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  ariaLabel?: string;
  ariaRequired?: boolean;
}

export const GreenFuelCheckbox: React.FC<GreenFuelCheckboxProps> = ({
  id,
  label,
  checked,
  onCheckedChange,
  ariaLabel,
  ariaRequired = false,
}) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div variants={itemVariants} className="flex items-center space-x-2">
      <ShadcnCheckbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-checked={checked ? "true" : "false"}
        aria-label={ariaLabel || label}
        aria-required={ariaRequired ? "true" : "false"}
        className="border-[#A5A5A5] data-[state=checked]:bg-[#41a350] data-[state=checked]:border-[#41a350]"
      />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none text-[#A5A5A5] cursor-pointer"
      >
        {label}
      </label>
    </motion.div>
  );
};
