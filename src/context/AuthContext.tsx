import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface User {
  email: string;
  name: string;
}

interface AuthToken {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextType {
  user: User | null;
  authToken: AuthToken;
  login: (email: string, password: string, rememberMe: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
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

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedToken = JSON.parse(storedToken) as AuthToken;
        const parsedUser = JSON.parse(storedUser) as User;

        setAuthToken(parsedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored authentication data:", error);
        logout();
      }
    }
  }, []);

  const login = useCallback(
    (email: string, password: string, rememberMe: boolean) => {
      const dummyAccessToken = "dummy-access-token";
      const dummyRefreshToken = "dummy-refresh-token";

      const userInfo = { email, name: "John Doe" };

      setAuthToken({
        accessToken: dummyAccessToken,
        refreshToken: dummyRefreshToken,
      });
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
      } else {
        sessionStorage.setItem(
          "authToken",
          JSON.stringify({
            accessToken: dummyAccessToken,
            refreshToken: dummyRefreshToken,
          })
        );
        sessionStorage.setItem("user", JSON.stringify(userInfo));
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setAuthToken({
      accessToken: null,
      refreshToken: null,
    });

    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
  }, []);

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