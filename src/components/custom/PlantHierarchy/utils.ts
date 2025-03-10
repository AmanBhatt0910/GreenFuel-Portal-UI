import { Designation } from './types';

// Get the highest level in a department + 1 (for auto-increment)
export const getNextLevel = (designations: Designation[]): number => {
  if (designations.length === 0) return 1;
  const maxLevel = Math.max(...designations.map((d) => d.level));
  return maxLevel + 1;
};

// Sort designations by level
export const getSortedDesignations = (designations: Designation[]): Designation[] => {
  return [...designations].sort((a, b) => a.level - b.level);
};

// Get CSS classes for level indicators
export const getLevelColor = (level: number): string => {
  const colors = [
    "bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
    "bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800",
    "bg-purple-50 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800",
    "bg-amber-50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
    "bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800",
  ];

  // Use modulo to cycle through colors for higher levels
  return colors[(level - 1) % colors.length];
}; 