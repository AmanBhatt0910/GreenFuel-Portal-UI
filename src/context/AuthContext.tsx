"use client";
import { createContext, ReactNode, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface UserInfoType {
  id: number;
  password: string;
  last_login: string;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  email: string;
  dob: string | null;
  employee_code: string | null;
  designation: string | null;
  groups: any[];
  user_permissions: any[];
}

interface AccessTokenType {
  access: string;
  refresh: string;
}

interface GFContextType {
  authToken: AccessTokenType | null;
  setAuthToken: Dispatch<SetStateAction<AccessTokenType | null>>;
  logout: () => void;
  baseURL: string;
  userInfo: UserInfoType | null;
  setUserInfo: Dispatch<SetStateAction<UserInfoType | null>>;
  login: (email: string, password: string) => Promise<void>;
}

export type { GFContextType, UserInfoType };

const GFContext = createContext<GFContextType>({
  authToken: null,
  setAuthToken: () => {},
  logout: () => {},
  baseURL: "",
  userInfo: null,
  setUserInfo: () => {},
  login: async () => {},
});

const GFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const baseURL = "http://192.168.1.3:8000";
  const baseURL = "http://127.0.0.1:8000";
  
  const router = useRouter();
  const [authToken, setAuthToken] = useState<AccessTokenType | null>(
    typeof window !== "undefined" && localStorage.getItem("accessToken")
      ? JSON.parse(
          (typeof window !== "undefined" &&
            localStorage.getItem("accessToken")) ||
            "{}"
        )
      : null
  );

  const [userInfo, setUserInfo] = useState<UserInfoType | null>(
    typeof window !== "undefined" && localStorage.getItem("userInfo")
      ? JSON.parse(
          (typeof window !== "undefined" && localStorage.getItem("userInfo")) ||
            "{}"
        )
      : null
  );

  const userLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(baseURL + `/auth/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.status === 200) {
        const tokenData = await response.json();
        setAuthToken(tokenData);
        localStorage.setItem("accessToken", JSON.stringify(tokenData));
        
        const userResponse = await fetch(baseURL + `/auth/user/`, {
          headers: {
            Authorization: `Bearer ${tokenData.access}`,
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserInfo(userData);
          localStorage.setItem("userInfo", JSON.stringify(userData));
        }
        
        router.push("/dashboard");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const userLogout = () => {
    setAuthToken(null);
    setUserInfo(null);
    typeof window !== "undefined" && localStorage.removeItem("accessToken");
    typeof window !== "undefined" && localStorage.removeItem("userInfo");
    router.push("/auth/login");
  };

  const contextData: GFContextType = {
    authToken,
    setAuthToken,
    logout: userLogout,
    baseURL,
    userInfo,
    setUserInfo,
    login: userLogin,
  };

  return (
    <GFContext.Provider value={contextData}>
      {children}
    </GFContext.Provider>
  );
};

export { GFContext, GFProvider };