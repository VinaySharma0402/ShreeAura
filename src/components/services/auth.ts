export const API_BASE = "https://api.shreeaura.in";

export interface User {
  id?: string | undefined;
  name: string;
  email: string;
  phone?: string;
  password?: string | undefined;
  state?: string;
  city?: string;
  address?: string;
  pincode?: number;
}

// ================= REGISTER =================
export const registerCustomer = async (user: User): Promise<{ token: string; role: string }> => {
  const response = await fetch(`${API_BASE}/auth/register-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to register user");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  return data;
};

// ================= LOGIN =================
export const loginCustomer = async (email: string, password: string): Promise<string> => {
  const params = new URLSearchParams({ email, password });
  const response = await fetch(`${API_BASE}/auth/login?${params.toString()}`, {
    method: "POST",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to login");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  console.log("Token stored in localStorage:", data.token);
  return data.token;
};

// ================= OTP HANDLING =================

// ✅ Send OTP
export const sendEmailOtp = async (email: string): Promise<string> => {
  const response = await fetch(`${API_BASE}/auth/send-email-otp?email=${encodeURIComponent(email)}`, {
    method: "POST",
  });

  const text = await response.text();

  if (!response.ok) {
    // Handle backend message for existing email
    if (text.includes("Email already registered")) {
      throw new Error("This email is already registered. Please log in instead.");
    }
    throw new Error(text || "Failed to send OTP");
  }

  console.log("OTP Response:", text);
  return text;
};

// ✅ Verify OTP
export const verifyEmailOtp = async (email: string, otp: string): Promise<string> => {
  const params = new URLSearchParams({ email, otp });
  const response = await fetch(`${API_BASE}/auth/verify-email?${params.toString()}`, {
    method: "POST",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to verify OTP");
  }

  const text = await response.text();
  console.log("OTP Verify Response:", text);
  return text;
};

// ================= UTILS =================
export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  console.log("Decoding token:", token);
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Decoded payload:", payload.User?.id);
    return payload.User?.id || payload.Costumer?.id || null;
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
};

export const isLoggedIn = (): boolean => {
  return localStorage.getItem("token") !== null;
};
