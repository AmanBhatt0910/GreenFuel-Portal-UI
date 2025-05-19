"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {  usePathname } from "next/navigation";

// Define the type for the navigation context
type NavigationContextType = {
  isNavigating: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
};

// Create the navigation context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNavigating, setIsNavigating] = useState(false); // Track navigation state
  const pathname = usePathname();

  // Function to start navigation (set isNavigating to true)
  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  // Function to stop navigation (set isNavigating to false)
  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  // Reset navigation state when the path changes
  useEffect(() => {
    stopNavigation();
  }, [pathname, stopNavigation]);

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation, stopNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use the Navigation context
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
