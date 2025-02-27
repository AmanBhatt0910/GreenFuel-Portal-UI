import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: {
    email: string;
    name: string;
  } | null;
  login: (email: string, password: string , rememberMe : boolean) => void;
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

  const login = (email: string, password: string , rememberMe : boolean) => {
    // setUser({ email , name });
    // if(rememberme){setCookies}
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
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
