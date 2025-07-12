import api from "@/lib/axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/context/AuthContext";

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refetchUser } = useAuthContext();

  useEffect(() => {
    const saveToken = async () => {
      const token = searchParams.get("token");
      if (!token) {
        window.location.href = "/auth/login";
        return;
      }

      try {
        await api.post("/auth/save-token", { token });
        await refetchUser();
        navigate("/dashboard/upload");
      } catch (error) {
        console.error("Failed to save token:", error);
        navigate("/auth/login");
      }
    };

    saveToken();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Signing you in...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Please wait while we finalize your authentication.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Callback;
