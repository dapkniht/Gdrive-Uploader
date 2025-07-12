import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

const ProtectedRoute = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user === null) {
      navigate("/auth/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || user === undefined) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Checking authentication...
      </div>
    );
  }

  return user ? <Outlet /> : null;
};

export default ProtectedRoute;
