import API from "../api/axios";

export const loginUser = async (
  data
) => {
  return API.post(
    "/auth/login",
    data
  );
};

export const registerUser = async (
  data
) => {
  return API.post(
    "/auth/register",
    data
  );
};

export const getCurrentUser = () => {
  return API.get(
    "/auth/me"
  );
};

export const resetPassword = (
  data
) => {
  return API.patch(
    "/auth/reset-password",
    data
  );
};