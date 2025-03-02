"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type NavigationContextType = {
  isNavigating: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  // Reset navigation state when the path changes
  useEffect(() => {
    stopNavigation();
  }, [pathname, stopNavigation]);

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        startNavigation,
        stopNavigation
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
