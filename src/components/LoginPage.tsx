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
              Sign In to Shree Grocery
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

                <motion.div variants={itemVariants} className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </motion.div>

                <div className="grid grid-cols-3 gap-3">
                  {[GoogleIcon, FacebookIcon, AppleIcon].map((Icon, i) => (
                    <button
                      key={i}
                      type="button"
                      className="flex items-center justify-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>

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
            © 2024 Shree Grocery. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Simple icons for the social buttons
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4" /><path d="M12.24 24.0008C15.4765 24.0008 18.2058 22.9382 20.19 21.1039L16.323 18.1056C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853" /><path d="M5.50253 14.3003C4.99987 12.8099 4.99987 11.1961 5.50253 9.70575V6.61481H1.5166C-0.18551 10.0056 -0.18551 14.0004 1.5166 17.3912L5.50253 14.3003Z" fill="#FBBC05" /><path d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.0344664 12.24 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50253 9.70575C6.45064 6.86173 9.10947 4.74966 12.24 4.74966Z" fill="#EA4335" /></svg>
)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437h-3.047v-3.49h3.047v-2.645c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.438c5.737-.905 10.125-5.901 10.125-11.926Z" /></svg>
)
const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.352 2.375c-1.229 1.498-1.025 3.398-.103 4.417 1.325 1.398 3.208 0.965 4.298-0.342 1.058-1.298 0.817-3.098-0.09-4.225-1.168-1.298-2.91-1.315-4.105 0.15zM17.155 18.173c-0.668 0.998-1.398 2.015-2.525 2.033-1.103 0.018-1.458-0.655-2.723-0.655-1.265 0-1.658 0.637-2.705 0.672-1.077 0.035-1.895-1.078-2.585-2.077-1.41-2.038-1.243-4.887 0.037-6.042 0.838-0.758 2.333-1.235 3.167-1.2 1.037 0.015 1.767 0.697 2.327 0.697 0.558 0 1.625-0.857 2.738-0.732 0.463 0.027 1.762 0.187 2.593 1.402-0.068 0.043-1.543 0.903-1.528 2.583 0.032 2.053 1.815 2.768 1.902 2.793-0.035 0.11-0.292 1.005-0.698 1.947z" /></svg>
)
