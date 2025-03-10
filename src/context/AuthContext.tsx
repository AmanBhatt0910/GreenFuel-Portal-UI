import { createContext, ReactNode, useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface UserInfoType {
  id: number;
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
  department: string | null;
  employee_code: string | null;
  designation: string | null;
  groups: any[];
  name : string,
  user_permissions: any[];
}

interface AccessTokenType {
  access: string;
  refresh: string;
}

interface LoginResponseType {
  success: boolean;
  message: string;
}

interface GFContextType {
  authToken: AccessTokenType | null;
  setAuthToken: Dispatch<SetStateAction<AccessTokenType | null>>;
  logout: () => void;
  baseURL: string;
  userInfo: UserInfoType | null;
  setUserInfo: Dispatch<SetStateAction<UserInfoType | null>>;
  login: (email: string, password: string) => Promise<LoginResponseType>;
}

export type { GFContextType, UserInfoType, LoginResponseType };

const GFContext = createContext<GFContextType>({
  authToken: null,
  setAuthToken: () => {},
  logout: () => {},
  baseURL: "",
  userInfo: null,
  setUserInfo: () => {},
  login: async () => ({ success: false, message: "" }),
});

const GFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const baseURL = "http://127.0.0.1:8000";
  // const baseURL = "http://192.168.1.3:8000";
  // const baseURL = "http://127.0.0.1:8000";

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

  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    }
  }, []);

  const userLogin = async (
    email: string,
    password: string
  ): Promise<LoginResponseType> => {
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
        return { success: true, message: "Login successful" };
      } else {
        if (response.status === 401) {
          return { success: false, message: "Invalid email or password" };
        } else if (response.status === 403) {
          return { success: false, message: "Your account is inactive" };
        } else {
          const errorData = await response.json().catch(() => ({}));
          return {
            success: false,
            message: errorData.detail || "Login failed. Please try again.",
          };
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
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
    <GFContext.Provider value={contextData}>{children}</GFContext.Provider>
  );
};

export { GFContext, GFProvider };
