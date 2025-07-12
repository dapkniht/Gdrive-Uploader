import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

const PublicRoute = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) return;
    if (user) {
      navigate("/dashboard/upload", { replace: true });
    }
  }, [user, navigate]);

  return <Outlet />;
};

export default PublicRoute;
