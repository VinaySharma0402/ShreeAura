import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { registerCustomer, sendEmailOtp, verifyEmailOtp } from './services/auth';
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RegisterPageProps {
  setCurrentPage: (page: string) => void;
}

export default function RegisterPage({ setCurrentPage }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP-related state
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      setOtpLoading(true);
      await sendEmailOtp(formData.email);
      toast.success('OTP sent to your email!');
      setOtpSent(true);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    try {
      setOtpLoading(true);
      await verifyEmailOtp(formData.email, otp);
      setOtpVerified(true);
      toast.success('Email verified successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Invalid or expired OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpVerified) {
      toast.error('Please verify your email before registering');
      return;
    }

    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      const response = await registerCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (response?.token) {
        setIsSuccess(true);
        toast.success('Account created successfully!');
        setTimeout(() => {
          setCurrentPage('home');
        }, 2000);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error: any) {
      toast.error(error?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome aboard!</h2>
          <p className="text-gray-500 text-lg mb-6">Your account has been created successfully.</p>
          <p className="text-sm font-medium text-[#FFD369]">Redirecting to homepage...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md z-10">

        {/* Header content */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <ImageWithFallback src="/logo.png" className="w-20 h-20 mb-4 drop-shadow-sm" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
            <p className="text-gray-500 mt-2 text-sm">Join Shree Aura family today</p>
          </div>
        </motion.div>

        <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#FFD369] focus:ring-[#FFD369]/20 rounded-xl"
                    placeholder="Enter your full name"
                  />
                </div>
              </motion.div>

              {/* Email + OTP */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#FFD369] focus:ring-[#FFD369]/20 rounded-xl"
                      placeholder="Enter your email"
                      disabled={otpVerified}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading || otpVerified}
                    className="bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffdc66] font-semibold shadow-sm h-11 px-4 rounded-xl"
                  >
                    {otpLoading ? "..." : otpVerified ? "Verified" : "Send OTP"}
                    {otpVerified && <ShieldCheck className="ml-1 w-4 h-4 text-green-700" />}
                  </Button>
                </div>
                {otpSent && !otpVerified && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex gap-2 mt-2"
                  >
                    <Input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#FFD369] focus:ring-[#FFD369]/20 rounded-xl tracking-widest text-center"
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading}
                      className="bg-[#1a0f1a] text-white hover:bg-black font-medium h-11 px-6 rounded-xl"
                    >
                      {otpLoading ? "..." : "Verify"}
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              {/* Phone */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#FFD369] focus:ring-[#FFD369]/20 rounded-xl"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#FFD369] focus:ring-[#FFD369]/20 rounded-xl"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password */}
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#FFD369] focus:ring-[#FFD369]/20 rounded-xl"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Terms */}
              <motion.div variants={itemVariants} className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                    className="border-gray-300 data-[state=checked]:bg-[#FFD369] data-[state=checked]:border-[#FFD369] text-white mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-500 leading-relaxed cursor-pointer">
                    I agree to the{' '}
                    <a href="#" className="text-[#E6B800] hover:text-[#d4a900] font-medium hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#E6B800] hover:text-[#d4a900] font-medium hover:underline">Privacy Policy</a>
                  </Label>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || !otpVerified}
                  className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffdc66] py-6 rounded-xl font-bold text-base shadow-lg shadow-[#FFD369]/20 transition-all duration-200 hover:shadow-[#FFD369]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#1a0f1a] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Redirect */}
            <motion.div variants={itemVariants} className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-[#E6B800] hover:text-[#d4a900] font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
