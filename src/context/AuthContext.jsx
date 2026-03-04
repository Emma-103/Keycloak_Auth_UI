import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildLoginUrl, fetchCurrentUser, requestLogout } from "../services/authApi";

const AuthContext = createContext(null);
const LOGIN_ATTEMPT_KEY = "iam_ui_login_attempt";
const LOGIN_ATTEMPT_TTL_MS = 5 * 60 * 1000;

function clearLoginAttempt() {
  sessionStorage.removeItem(LOGIN_ATTEMPT_KEY);
}

function readLoginAttempt() {
  const raw = sessionStorage.getItem(LOGIN_ATTEMPT_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.startedAt || typeof parsed.startedAt !== "number") {
      clearLoginAttempt();
      return null;
    }

    if (Date.now() - parsed.startedAt > LOGIN_ATTEMPT_TTL_MS) {
      clearLoginAttempt();
      return null;
    }

    return parsed;
  } catch {
    clearLoginAttempt();
    return null;
  }
}

function writeLoginAttempt(returnUrl) {
  sessionStorage.setItem(
    LOGIN_ATTEMPT_KEY,
    JSON.stringify({
      startedAt: Date.now(),
      returnUrl
    })
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const isAuthenticated = Boolean(user);

  const resetAuthFlow = () => {
    clearLoginAttempt();
    setAuthError("");
  };

  const logout = async () => {
    try {
      const response = await requestLogout();
      const logoutUrl = response?.data?.url || response?.url;
      resetAuthFlow();
      setUser(null);
      if (logoutUrl) {
        window.location.assign(logoutUrl);
        return;
      }
    } catch (error) {
      console.warn("Failed to log out:", error);
    }

    resetAuthFlow();
    setUser(null);
    navigate("/login", { replace: true });
  };

  const beginLogin = async (options = {}) => {
    const { force = false, returnUrl: explicitReturnUrl } = options;
    if (!force && readLoginAttempt()) {
      return;
    }

    const returnUrl = explicitReturnUrl || window.location.href;
    writeLoginAttempt(returnUrl);
    setAuthError("");
    const loginUrl = buildLoginUrl(returnUrl);
    window.location.assign(loginUrl);
  };

  const loadSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCurrentUser();
      const userInfo = response?.data || null;
      setUser(userInfo);
      if (userInfo) {
        resetAuthFlow();
      } else if (readLoginAttempt()) {
        setAuthError("Authentication returned successfully, but no active BFF session was found.");
      } else {
        setAuthError("");
      }
    } catch (error) {
      console.warn("Failed to load session:", error);
      setUser(null);
      if (readLoginAttempt()) {
        setAuthError("Session validation failed after login. Please try signing in again.");
      } else {
        setAuthError(error.message || "Unable to validate session.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      authError,
      beginLogin,
      logout,
      reloadSession: loadSession,
      resetAuthFlow
    }),
    [user, isAuthenticated, isLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
