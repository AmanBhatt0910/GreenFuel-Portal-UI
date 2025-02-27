"use client"
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner"
import { GreenFuelToaster } from "@/components/custom/Toaster/Toaster.custom";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  return (
    <AuthProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <GreenFuelToaster/>
      </NextThemesProvider>
    </AuthProvider>
  );
};

export default Provider;
