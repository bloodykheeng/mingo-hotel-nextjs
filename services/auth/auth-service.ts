import axiosAPI, { setNewHeaders, setProfileHeaders } from "../axiosApi";

export async function getSanctumCsrf() {
  const response = await axiosAPI.get("/sanctum/csrf-cookie");
  return response;
}

export async function postTologin(data: { email: string; password: string }) {
  const response = await axiosAPI.post("/login", data);
  setNewHeaders(response);
  setProfileHeaders(response);
  return response;
}

export async function forgotPassword(data: any) {
  const response = await axiosAPI.post("forgot-password", data);
  return response;
}

export async function postToValidateWebOtp(data: {
  email?: string;
  otp: number;
}) {
  const response = await axiosAPI.post(`validate-web-login-otp`, data);
  setNewHeaders(response);
  setProfileHeaders(response);
  return response;
}



export async function postToRegister(data: any) {
  const response = await axiosAPI.post("/register", data);
  // setNewHeaders(response);
  // setProfileHeaders(response);
  return response;
}

export async function getUserService(params: any = {}) {
  const response = await axiosAPI.get("get-logged-in-user", {
    params: params?.params,
    signal: params?.signal
  });
  return response;
}
export async function postToLogout(data: any) {
  const response = await axiosAPI.post(`logout`, data);
  return response;
}

export async function getAssignableRoles(params = {}) {
  const response = await axiosAPI.get("roles", { params: params });
  return response;
}
