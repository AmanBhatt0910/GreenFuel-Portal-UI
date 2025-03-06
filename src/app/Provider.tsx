"use client"
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import  {GFProvider}  from "@/context/AuthContext";
import { GreenFuelToaster } from "@/components/custom/Toaster/Toaster.custom";


interface ProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  return (
    <GFProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <GreenFuelToaster/>
        </NextThemesProvider>
      
    </GFProvider>
  );
};

export default Provider;