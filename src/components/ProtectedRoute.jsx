import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, beginLogin, authError, resetAuthFlow } = useAuth();
  const [redirectError, setRedirectError] = useState("");
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !attempted && !authError) {
      setAttempted(true);
      beginLogin().catch((error) => {
        console.error("Login redirect failed:", error);
        setRedirectError(error.message || "Unable to start sign-in flow.");
      });
    }
  }, [isAuthenticated, isLoading, beginLogin, attempted, authError]);

  if (isLoading) {
    return (
      <div className="screen-center">
        <h2>Checking session...</h2>
        <p>Confirming authentication status.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const currentError = authError || redirectError;
    if (currentError) {
      const retryLogin = () => {
        setAttempted(false);
        setRedirectError("");
        resetAuthFlow();
        beginLogin({ force: true }).catch((error) => {
          console.error("Retry login redirect failed:", error);
          setRedirectError(error.message || "Unable to start sign-in flow.");
        });
      };

      return (
        <div className="screen-center">
          <h2>Authentication Error</h2>
          <p>{currentError}</p>
          <button type="button" onClick={retryLogin}>
            Try Sign In Again
          </button>
        </div>
      );
    }

    return (
      <div className="screen-center">
        <h2>Redirecting to Sign In...</h2>
        <p>Requesting authorization from IAM service.</p>
      </div>
    );
  }

  return children;
}
