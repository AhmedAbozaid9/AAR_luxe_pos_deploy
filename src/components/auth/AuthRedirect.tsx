import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect = ({ children }: AuthRedirectProps) => {
  const { isAuthenticated, isLoading, initializeAuth } = useUserStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Don't redirect while loading
  if (isLoading) {
    return <>{children}</>;
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthRedirect;
