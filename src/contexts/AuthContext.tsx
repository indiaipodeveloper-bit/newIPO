import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo (remove when backend is connected)
const MOCK_USERS: (User & { password: string })[] = [
  { id: "1", name: "Super Admin", email: "admin@indiaipo.in", password: "admin123", role: "super_admin", status: "active" },
  { id: "2", name: "Editor User", email: "editor@indiaipo.in", password: "editor123", role: "editor", status: "active" },
  { id: "3", name: "Investor", email: "investor@indiaipo.in", password: "investor123", role: "investor", status: "active" },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login — replace with: const data = await authApi.login(email, password);
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const { password: _, ...userData } = found;
    const mockToken = "mock-jwt-" + Date.now();
    setUser(userData);
    setToken(mockToken);
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock register — replace with: const data = await authApi.register({ name, email, password });
    const newUser: User = { id: Date.now().toString(), name, email, role: "guest", status: "active" };
    const mockToken = "mock-jwt-" + Date.now();
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAdmin = user?.role === "super_admin" || user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
