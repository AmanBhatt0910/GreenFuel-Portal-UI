import {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

interface User {
  email: string;
  name: string;
}

interface AuthToken {
  accessToken: string | null;
  refreshToken: string | null;
}

interface UserInfoType {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  authToken: AuthToken;
  login: (email: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
  baseURL: string;
  userInfo: UserInfoType | null;
  setUserInfo: Dispatch<SetStateAction<UserInfoType | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<AuthToken>({
    accessToken: null,
    refreshToken: null,
  });
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const baseURL = "https://api.greenfuel.com"; // Change to your actual API URL

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAuthToken(JSON.parse(storedToken));
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, rememberMe: boolean) => {
    const dummyAccessToken = "dummy-access-token";
    const dummyRefreshToken = "dummy-refresh-token";

    setAuthToken({
      accessToken: dummyAccessToken,
      refreshToken: dummyRefreshToken,
    });

    const userInfo = { email, name: "John Doe" };

    setUser(userInfo);

    if (rememberMe) {
      localStorage.setItem("authToken", JSON.stringify({ accessToken: dummyAccessToken, refreshToken: dummyRefreshToken }));
      localStorage.setItem("user", JSON.stringify(userInfo));
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken({ accessToken: null, refreshToken: null });
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout, baseURL, userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
