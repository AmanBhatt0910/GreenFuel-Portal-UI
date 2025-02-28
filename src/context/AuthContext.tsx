import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: {
    email: string;
    name: string;
  } | null;
  authToken: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  login: (email: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );
  const [authToken, setAuthToken] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
  }>({
    accessToken: null,
    refreshToken: null,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedToken = JSON.parse(storedToken);
      const parsedUser = JSON.parse(storedUser);

      setAuthToken(parsedToken);
      setUser(parsedUser);
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
      localStorage.setItem(
        "authToken",
        JSON.stringify({
          accessToken: dummyAccessToken,
          refreshToken: dummyRefreshToken,
        })
      );
      localStorage.setItem("user", JSON.stringify(userInfo));
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken({
      accessToken: null,
      refreshToken: null,
    });

    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  const isAuthenticated = authToken.accessToken !== null;

  return (
    <AuthContext.Provider
      value={{ user, authToken, login, logout, isAuthenticated }}
    >
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
