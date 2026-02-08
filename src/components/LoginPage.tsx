import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import {
  loginCustomer,

  verifyEmailOtp,
  API_BASE,
  sendForgotPasswordOtp,
} from "./services/auth";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
}

export default function LoginPage({ setCurrentPage }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password flow
  const [forgotMode, setForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [forgotLoading, setForgotLoading] = useState(false);

  // ---------------- LOGIN HANDLER ----------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      setIsLoading(true);
      const token = await loginCustomer(loginData.email, loginData.password);
      if (token) {
        toast.success("Welcome back!");
        setCurrentPage("home");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error: any) {
      toast.error(error?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- FORGOT PASSWORD FLOW ----------------
  const handleSendOtp = async () => {
    if (!forgotData.email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setForgotLoading(true);
      await sendForgotPasswordOtp(forgotData.email);
      toast.success("OTP sent successfully to your email!");
      setOtpSent(true);
    } catch (err: any) {
      console.error("Send OTP Error:", err);
      toast.error(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!forgotData.otp) {
      toast.error("Please enter the OTP");
      return;
    }
    try {
      setForgotLoading(true);
      await verifyEmailOtp(forgotData.email, forgotData.otp);
      toast.success("OTP verified successfully!");
      setVerified(true);
    } catch (err: any) {
      console.error("OTP Verify Error:", err);
      toast.error(err?.message || "Invalid OTP. Please check again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!forgotData.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    try {
      setForgotLoading(true);
      const response = await fetch(
        `${API_BASE}/auth/reset-password?email=${encodeURIComponent(
          forgotData.email
        )}&newPassword=${encodeURIComponent(forgotData.newPassword)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to reset password");
      }

      toast.success("Password reset successfully! You can now log in.");
      setForgotMode(false);
      setOtpSent(false);
      setVerified(false);
      setForgotData({ email: "", otp: "", newPassword: "" });
    } catch (err: any) {
      console.error("Reset Password Error:", err);
      toast.error(err?.message || "Password reset failed. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  // ---------------- ANIMATIONS ----------------
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };



  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md z-10"
      >
        {/* Logo + Title */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <ImageWithFallback src="/logo.png" className="w-24 h-24 mb-4 drop-shadow-sm" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Sign In to Shree Aura
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Welcome back! Please enter your details.</p>
          </div>
        </motion.div>

        {/* CARD */}
        <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            {!forgotMode ? (
              // ---------------- LOGIN FORM ----------------
              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-700 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#FFD369] focus:ring-[#FFD369]/20 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#FFD369] focus:ring-[#FFD369]/20 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={loginData.rememberMe}
                      onCheckedChange={(checked) =>
                        setLoginData({
                          ...loginData,
                          rememberMe: checked as boolean,
                        })
                      }
                      className="border-gray-300 data-[state=checked]:bg-[#FFD369] data-[state=checked]:border-[#FFD369] text-white"
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-gray-600 text-sm cursor-pointer"
                    >
                      Remember for 30 days
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-[#E6B800] hover:text-[#d4a900] text-sm font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffdc66] py-6 rounded-xl font-bold text-base shadow-lg shadow-[#FFD369]/20 transition-all duration-200 hover:shadow-[#FFD369]/40 hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-[#1a0f1a] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </motion.div>



                <div className="text-center pt-2">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setCurrentPage("register")}
                      className="text-[#E6B800] hover:text-[#d4a900] font-semibold hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              // ---------------- FORGOT PASSWORD FLOW ----------------
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => {
                      setForgotMode(false);
                      setOtpSent(false);
                      setVerified(false);
                      setForgotData({ email: "", otp: "", newPassword: "" });
                    }}
                    className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm font-medium transition-colors"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">
                    Reset Password
                  </h2>
                </div>

                <p className="text-gray-500 text-sm text-center">
                  {!otpSent ? "Enter your email for a verification code." : !verified ? "Enter the code sent to your email." : "Set your new password."}
                </p>

                {!otpSent && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Email Address</Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={forgotData.email}
                        onChange={(e) =>
                          setForgotData({ ...forgotData, email: e.target.value })
                        }
                        className="bg-white border-gray-200 text-gray-900 h-11 rounded-xl focus:border-[#FFD369] focus:ring-[#FFD369]/20"
                      />
                    </div>
                    <Button
                      onClick={handleSendOtp}
                      disabled={forgotLoading}
                      className="w-full bg-[#FFD369] text-[#1a0f1a]  hover:bg-[#ffdc66] py-6 rounded-xl font-bold shadow-lg shadow-[#FFD369]/20"
                    >
                      {forgotLoading ? (
                        <div className="w-5 h-5 border-2 border-[#1a0f1a] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Send Code"
                      )}
                    </Button>
                  </div>
                )}

                {otpSent && !verified && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Verification Code</Label>
                      <Input
                        type="text"
                        placeholder="e.g. 123456"
                        value={forgotData.otp}
                        onChange={(e) =>
                          setForgotData({ ...forgotData, otp: e.target.value })
                        }
                        className="bg-white border-gray-200 text-gray-900 h-11 rounded-xl focus:border-[#FFD369] focus:ring-[#FFD369]/20 tracking-widest text-center text-lg font-mono"
                      />
                    </div>
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={forgotLoading}
                      className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffdc66] py-6 rounded-xl font-bold shadow-lg shadow-[#FFD369]/20"
                    >
                      {forgotLoading ? (
                        <div className="w-5 h-5 border-2 border-[#1a0f1a] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Verify Code"
                      )}
                    </Button>
                  </div>
                )}

                {verified && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">New Password</Label>
                      <Input
                        type="password"
                        placeholder="Min. 8 chars"
                        value={forgotData.newPassword}
                        onChange={(e) =>
                          setForgotData({
                            ...forgotData,
                            newPassword: e.target.value,
                          })
                        }
                        className="bg-white border-gray-200 text-gray-900 h-11 rounded-xl focus:border-[#FFD369] focus:ring-[#FFD369]/20"
                      />
                    </div>
                    <Button
                      onClick={handleResetPassword}
                      disabled={forgotLoading}
                      className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffdc66] py-6 rounded-xl font-bold shadow-lg shadow-[#FFD369]/20"
                    >
                      {forgotLoading ? (
                        <div className="w-5 h-5 border-2 border-[#1a0f1a] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---------------- FOOTER ---------------- */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            © 2024 Shree Aura. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

