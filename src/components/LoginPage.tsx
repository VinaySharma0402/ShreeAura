import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
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

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-[#FFD369]/20 rounded-full"
      animate={{
        y: [0, -20, 0],
        x: [0, Math.random() * 20 - 10, 0],
        opacity: [0.2, 0.8, 0.2],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
      style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
    />
  ));

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gradient from-[#1a0f1a] via-[#2C1E4A] to-[#4B1C3F] flex items-center justify-center p-4 relative overflow-hidden">
      {floatingElements}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md z-10"
      >
        {/* Logo + Title */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center">
            <ImageWithFallback src="/logo.png" className="w-30 h-30" />
            <h1 className="text-4xl font-bold text-[#FFD369] ml-2">
              Shree Aura
            </h1>
          </div>
          <p className="text-white/80">Welcome back to Shree Aura</p>
        </motion.div>

        {/* CARD */}
        <Card className="bg-white/10 backdrop-blur-lg border-[#FFD369]/20 shadow-2xl">
          <CardContent className="p-8 space-y-6">
            {!forgotMode ? (
              // ---------------- LOGIN FORM ----------------
              <>
                <motion.div
                  variants={itemVariants}
                  className="text-center space-y-2"
                >
                  <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
                  <p className="text-white/70">
                    Sign in to continue your beauty journey
                  </p>
                </motion.div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <motion.div variants={itemVariants} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-white">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD369] w-4 h-4" />
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
                          className="pl-10 bg-[#2C1E4A]/50 border-[#FFD369]/30 text-white placeholder:text-white/50 focus:border-[#FFD369]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-white">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD369] w-4 h-4" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                          className="pl-10 pr-10 bg-[#2C1E4A]/50 border-[#FFD369]/30 text-white placeholder:text-white/50 focus:border-[#FFD369]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FFD369] hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
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
                        className="border-[#FFD369] data-[state=checked]:bg-[#FFD369]"
                      />
                      <Label
                        htmlFor="remember-me"
                        className="text-white/80 text-sm"
                      >
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForgotMode(true)}
                      className="text-[#FFD369] hover:text-white text-sm transition-colors"
                    >
                      Forgot password?
                    </button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#FFD369]/90 py-3 font-semibold transition-all duration-200 hover:scale-105"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-[#1a0f1a] border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  variants={itemVariants}
                  className="text-center pt-4 border-t border-[#FFD369]/20"
                >
                  <p className="text-white/70">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setCurrentPage("register")}
                      className="text-[#FFD369] hover:underline font-medium"
                    >
                      Sign Up
                    </button>
                  </p>
                </motion.div>
              </>
            ) : (
              // ---------------- FORGOT PASSWORD FLOW ----------------
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    Forgot Password
                  </h2>
                  <button
                    onClick={() => {
                      setForgotMode(false);
                      setOtpSent(false);
                      setVerified(false);
                      setForgotData({ email: "", otp: "", newPassword: "" });
                    }}
                    className="text-[#FFD369] hover:text-white flex items-center gap-1 text-sm"
                  >
                    <ArrowLeft size={16} /> Back to login
                  </button>
                </div>

                {!otpSent && (
                  <div className="space-y-4">
                    <Label className="text-white">Enter your email</Label>
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={forgotData.email}
                      onChange={(e) =>
                        setForgotData({ ...forgotData, email: e.target.value })
                      }
                      className="bg-[#2C1E4A]/50 border-[#FFD369]/30 text-white"
                    />
                    <Button
                      onClick={handleSendOtp}
                      disabled={forgotLoading}
                      className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#FFD369]/90 transition-all duration-200"
                    >
                      {forgotLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-[#1a0f1a] border-t-transparent rounded-full"
                        />
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </div>
                )}

                {otpSent && !verified && (
                  <div className="space-y-4">
                    <Label className="text-white">Enter OTP</Label>
                    <Input
                      type="text"
                      placeholder="Enter the OTP"
                      value={forgotData.otp}
                      onChange={(e) =>
                        setForgotData({ ...forgotData, otp: e.target.value })
                      }
                      className="bg-[#2C1E4A]/50 border-[#FFD369]/30 text-white"
                    />
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={forgotLoading}
                      className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#FFD369]/90 transition-all duration-200"
                    >
                      {forgotLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-[#1a0f1a] border-t-transparent rounded-full"
                        />
                      ) : (
                        "Verify OTP"
                      )}
                    </Button>
                  </div>
                )}

                {verified && (
                  <div className="space-y-4">
                    <Label className="text-white">Enter new password</Label>
                    <Input
                      type="password"
                      placeholder="New password"
                      value={forgotData.newPassword}
                      onChange={(e) =>
                        setForgotData({
                          ...forgotData,
                          newPassword: e.target.value,
                        })
                      }
                      className="bg-[#2C1E4A]/50 border-[#FFD369]/30 text-white"
                    />
                    <Button
                      onClick={handleResetPassword}
                      disabled={forgotLoading}
                      className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#FFD369]/90 transition-all duration-200"
                    >
                      {forgotLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-[#1a0f1a] border-t-transparent rounded-full"
                        />
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
        <motion.div variants={itemVariants} className="mt-8 text-center space-y-4">
          <div className="flex justify-center space-x-6">
            {[Instagram, Facebook, Twitter].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-white/60 hover:text-[#FFD369] transition-colors"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="#" className="text-white/60 hover:text-[#FFD369]">
              Help Center
            </a>
            <span className="text-white/40">•</span>
            <a href="#" className="text-white/60 hover:text-[#FFD369]">
              Contact Us
            </a>
            <span className="text-white/40">•</span>
            <a href="#" className="text-white/60 hover:text-[#FFD369]">
              Privacy
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
