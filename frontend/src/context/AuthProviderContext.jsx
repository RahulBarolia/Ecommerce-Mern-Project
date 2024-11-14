import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (credentials) => {
    try {
      const response = await apiClient.post("/user/register", credentials);
      return response;
    } catch (error) {
      return error;
    }
  };

  const verifyEmail = async (code) => {
    try {
      const response = await apiClient.post("/user/verify-email", { code });
      return response;
    } catch (error) {
      return error;
    }
  };

  const resendverificationEmailOtp = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await apiClient.post("/user/resend-verification-code", {
        email,
      });
      return response;
    } catch (error) {
      return error;
    }
  };

  const userEmailConfirmForResetPass = async (emailData) => {
    try {
      const response = await apiClient.post("/user/forgot-password", emailData);
      return response;
    } catch (error) {
      return error;
    }
  };

  const userOtpConfirmForResetPass = async (code) => {
    try {
      const response = await apiClient.post(
        "/user/verify-reset-password-code",
        { code }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  const resendOtpForResetPass = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await apiClient.post(
        "/user/resend-reset-password-code",
        {
          email,
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  const resetPassword = async (credentials) => {
    try {
      const resetToken = localStorage.getItem("reset_token");
      credentials.resetToken = resetToken;
      const response = await apiClient.post(
        "/user/reset-password",
        credentials
      );
      return response;
    } catch (error) {
      return error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiClient.post("/user/login", credentials);
      if (response.data.success) {
        setUser(response.data.user._id);
      }
      return response;
    } catch (error) {
      return error;
    }
  };

  const profile = async () => {
    try {
      const response = await apiClient.post("/user/profile");
      if (response?.data?.success) {
        setUser(response?.data?.userId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  let isRefreshing = false;
  let isLoggingOut = false;

  const logout = async () => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    try {
      const response = await apiClient.post("/user/logout");
      if (response?.data?.success) {
        setUser(null);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      isLoggingOut = false;
    }
  };

  const refreshAccessToken = async () => {
    if (isRefreshing) return;
    isRefreshing = true;

    try {
      await apiClient.post("/user/refresh-token");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Refresh token expired, logging out...");
        await logout();
      } else {
        console.error("Error refreshing token:", error);
      }
    } finally {
      isRefreshing = false;
    }
  };

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (isLoggingOut) {
        return Promise.reject(error);
      }

      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        await refreshAccessToken();

        return apiClient(originalRequest);
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    profile();
  }, []);

  const contextValue = {
    user,
    register,
    login,
    verifyEmail,
    resendverificationEmailOtp,
    userEmailConfirmForResetPass,
    userOtpConfirmForResetPass,
    resendOtpForResetPass,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
