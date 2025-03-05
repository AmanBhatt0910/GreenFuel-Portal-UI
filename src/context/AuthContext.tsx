"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "@/lib/toast-util";
import useAxios from "@/hooks/use-axios";

interface User {
  email: string;
  name: string;
  role: string;
  // Add other user properties as needed
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  authToken: AuthToken | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void; 
  setTokens: (accessToken: string, refreshToken: string) => void;
}

// Context provides default values for authToken, user, and login
const AuthContext = createContext<AuthContextType>({
  user: null,
  authToken: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isLoading: false,
  setIsLoading: () => {},
  setTokens: () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Base URL for API
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // State for user data
  const [user, setUser] = useState<User | null>(null);
  
  // State for authentication token
  const [authToken, setAuthToken] = useState<AuthToken | null>(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Computed property for checking if user is authenticated
  const isAuthenticated = !!authToken?.accessToken;

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUserData = () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");
      
      if (storedToken) {
        try {
          const parsedToken = JSON.parse(storedToken);
          setAuthToken(parsedToken);
        } catch (error) {
          console.error("Error parsing stored token:", error);
          localStorage.removeItem("authToken");
        }
      }
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
        }
      }
    };
    
    loadUserData();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${baseURL}/auth/token/`, {
        email,
        password
      });
      
      console.log("Login response:", response.data);
      
      const { access, refresh } = response.data;
      
      if (!access || !refresh) {
        console.error("Invalid token response format:", response.data);
        toast.error("Invalid authentication response from server");
        setIsLoading(false);
        return false;
      }
      
      // Update state with token data
      setAuthToken({
        accessToken: access,
        refreshToken: refresh
      });
      
      // Try to fetch user data if your API supports it
      // try {
      //   // You may need to adjust this endpoint
      //   const userResponse = await axios.get(`${baseURL}/auth/me/`, {
      //     headers: {
      //       Authorization: `Bearer ${access}`
      //     }
      //   });
        
      //   setUser(userResponse.data);
      //   localStorage.setItem("user", JSON.stringify(userResponse.data));
      // } catch (userError) {
      //   console.warn("Could not fetch user details:", userError);
      //   // Proceed anyway since we have the tokens
      // }
      
      // Store auth tokens in localStorage
      localStorage.setItem("authToken", JSON.stringify({ 
        accessToken: access, 
        refreshToken: refresh 
      }));
      
      toast.success("Login successful!");
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.detail || "Login failed. Please check your credentials.");
      setIsLoading(false);
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    // Optionally call logout API endpoint here
    // Clear user data and tokens
    setUser(null);
    setAuthToken(null);
    
    // Remove stored data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    
    toast.success("Logged out successfully");
  };
  
  // Function to update tokens (used for token refresh)
  const setTokens = (accessToken: string, refreshToken: string) => {
    const newTokens = { accessToken, refreshToken };
    setAuthToken(newTokens);
    localStorage.setItem("authToken", JSON.stringify(newTokens));
  };

  // Provide auth context to children components
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        authToken, 
        login, 
        logout, 
        isAuthenticated, 
        isLoading,
        setIsLoading,
        setTokens
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
