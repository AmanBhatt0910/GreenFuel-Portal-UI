"use client";
import { createContext, ReactNode, useState } from "react";

import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface UserInfoType {
  id: number;
  name: string;
  email: string;
  phone_no: string;
  user_id: string;
  user_type: string;
  email_verified: boolean;
  phone_verified: boolean;
  aadhar_verified: boolean;
  pan_verified: boolean;
  p_address: string;
  date_joined: string;
  last_login: string;
  status: boolean;
  referral: any;
  VendorInfo: any;
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
  login: (email: string, password: string) => void;
}

export type { GFContextType };

const GFContext = createContext<GFContextType>({
  authToken: null,
  setAuthToken: () => {},
  logout: () => {},
  baseURL: "",
  userInfo: null,
  setUserInfo: () => {},
  login: () => {},
});

const GFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
    const response = await fetch(baseURL + `/auth/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.status == 200) {
      const data = await response.json();
      setAuthToken(data);
      localStorage.setItem("accessToken", JSON.stringify(data));
    } else {
      console.error("Unexpected response structure:", response);
    }
  };

  const userLogout = () => {
    setAuthToken(null);
    typeof window !== "undefined" && localStorage.removeItem("accessToken");
    typeof window !== "undefined" && localStorage.removeItem("userInfo");
    router.push("/auth/login");
  };

  const ContextData: GFContextType = {
    authToken,
    setAuthToken,
    logout: userLogout,
    baseURL,
    userInfo,
    setUserInfo,
    login: userLogin,
  };

  return (
    <GFContext.Provider value={ContextData}>{children}</GFContext.Provider>
  );
};

export { GFContext, GFProvider };
