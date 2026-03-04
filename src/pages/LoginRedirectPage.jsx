import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginRedirectPage() {
  const { beginLogin } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    beginLogin({ force: true }).catch((err) => setError(err.message || "Unable to start login."));
  }, [beginLogin]);

  if (error) {
    return (
      <div className="screen-center">
        <h2>Authentication Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="screen-center">
      <h2>Redirecting to Sign In...</h2>
      <p>Starting authorization flow.</p>
    </div>
  );
}
