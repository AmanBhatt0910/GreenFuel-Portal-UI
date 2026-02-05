import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

/**
 * Format a date string to a user-friendly format
 */
export function formatDate(
  dateString: string | number | Date | undefined | null,
): string {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateString}`);
      return String(dateString);
    }

    // Format the date and time
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format hours and minutes with leading zeros if needed
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${day} ${month} on ${formattedHours}:${formattedMinutes}`;
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return String(dateString);
  }
}

/**
 * Convert a number to words (for Indian currency)
 */
export function numberToWords(num: number): string {
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (num === 0) return "Zero";

  function convertLessThanOneThousand(n: number): string {
    if (n < 20) return units[n];
    const digit = n % 10;
    if (n < 100)
      return tens[Math.floor(n / 10)] + (digit ? " " + units[digit] : "");
    return (
      units[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " and " + convertLessThanOneThousand(n % 100) : "")
    );
  }

  let result = "";
  let remaining = num;

  if (remaining >= 10000000) {
    result +=
      convertLessThanOneThousand(Math.floor(remaining / 10000000)) + " Crore ";
    remaining %= 10000000;
  }

  if (remaining >= 100000) {
    result +=
      convertLessThanOneThousand(Math.floor(remaining / 100000)) + " Lakh ";
    remaining %= 100000;
  }

  if (remaining >= 1000) {
    result +=
      convertLessThanOneThousand(Math.floor(remaining / 1000)) + " Thousand ";
    remaining %= 1000;
  }

  if (remaining > 0) {
    result += convertLessThanOneThousand(remaining);
  }

  return result.trim();
}

/**
 * Get color class based on status
 */
export function getStatusColor(status: string): string {
  const statusLower = status?.toLowerCase() || "";

  switch (statusLower) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
}

/**
 * Get icon component based on status
 */
export function getStatusIcon(status: string) {
  const statusLower = status?.toLowerCase() || "";

  switch (statusLower) {
    case "approved":
      return CheckCircle;
    case "rejected":
      return XCircle;
    case "pending":
      return Clock;
    default:
      return AlertCircle;
  }
}

/**
 * Check if a status is pending (case insensitive)
 */
export function isPending(status: string): boolean {
  if (!status) return false;
  const statusLower = status.toLowerCase();
  return (
    statusLower === "pending" ||
    statusLower.includes("pending for") ||
    statusLower.includes("pending approval") ||
    statusLower === "current"
  );
}
