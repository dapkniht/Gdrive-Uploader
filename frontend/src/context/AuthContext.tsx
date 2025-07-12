import api from "@/lib/axios";
import type { User } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null | undefined;
  loading: boolean;
  handleLogout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(error);
    } finally {
      setUser(undefined);
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, handleLogout, refetchUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};
