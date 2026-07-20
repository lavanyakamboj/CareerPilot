import api from "../api/api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

export const googleAuth = async (credential) => {
  const response = await api.post("/auth/google", { credential });

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);

  return response.data;
};

export const resendVerificationEmail = async (email) => {
  const response = await api.post("/auth/resend-verification", { email });

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });

  return response.data;
};

export const resetPassword = async ({ token, otp, password }) => {
  const response = await api.post("/auth/reset-password", {
    token,
    otp,
    password,
  });

  return response.data;
};