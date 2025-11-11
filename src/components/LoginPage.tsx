import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Facebook, Instagram, Twitter, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { loginCustomer } from './services/auth';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
}

export default function LoginPage({ setCurrentPage }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const token = await loginCustomer(loginData.email, loginData.password);
      if (token) {
        localStorage.setItem('token', token);
        toast.success('Welcome back!');
        setCurrentPage('home');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const socialButtons = [
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Google', icon: Mail, color: 'bg-red-600 hover:bg-red-700' },
    { name: 'Apple', icon: Lock, color: 'bg-gray-800 hover:bg-gray-900' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-[#FFD369]/20 rounded-full"
      animate={{
        y: [0, -20, 0],
        x: [0, Math.random() * 20 - 10, 0],
        opacity: [0.2, 0.8, 0.2]
      }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
      style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient from-[#1a0f1a] via-[#2C1E4A] to-[#4B1C3F] flex items-center justify-center p-4 relative overflow-hidden">
      {floatingElements}

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gPGcgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIj4gPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPiA8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIyIi8+IDwvZz4gPC9nPiA8L3N2Zz4=')] opacity-30"></div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative w-full max-w-md z-10">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center">
  
            <ImageWithFallback
              src="/logo.png"
               className="w-30 h-30 text-[#FFD369]"
                 />
  

                  <h1 className="text-4xl font-bold text-[#FFD369]">
                             Shree Aura
                                     </h1>
                      </div>

          <p className="text-white/80">Welcome back to Shree Aura</p>
        </motion.div>

        <Card className="bg-white/10 backdrop-blur-lg border-[#FFD369]/20 shadow-2xl">
          <CardContent className="p-8 space-y-6">
            <motion.div variants={itemVariants} className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
              <p className="text-white/70">Sign in to continue your beauty journey</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-white">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD369] w-4 h-4" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="pl-10 bg-[#2C1E4A]/50 border-[#FFD369]/30 text-white placeholder:text-white/50 focus:border-[#FFD369]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD369] w-4 h-4" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="pl-10 pr-10 bg-[#2C1E4A]/50 border-[#FFD369]/30 text-white placeholder:text-white/50 focus:border-[#FFD369]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FFD369] hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={loginData.rememberMe}
                    onCheckedChange={(checked) => setLoginData({ ...loginData, rememberMe: checked as boolean })}
                    className="border-[#FFD369] data-[state=checked]:bg-[#FFD369] data-[state=checked]:text-[#1a0f1a]"
                  />
                  <Label htmlFor="remember-me" className="text-white/80 text-sm">Remember me</Label>
                </div>
                <a href="#" className="text-[#FFD369] hover:text-white text-sm transition-colors">Forgot password?</a>
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
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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

            

            <motion.div variants={itemVariants} className="text-center pt-4 border-t border-[#FFD369]/20">
              <p className="text-white/70">
                Don't have an account?{' '}
                <button
                  onClick={() => setCurrentPage('register')}
                  className="text-[#FFD369] hover:underline font-medium"
                >
                  Sign Up
                </button>
              </p>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div variants={itemVariants} className="mt-8 text-center space-y-4">
          <div className="flex justify-center space-x-6">
            {[Instagram, Facebook, Twitter].map((Icon, index) => (
              <motion.a key={index} href="#" whileHover={{ scale: 1.2, rotate: 5 }} className="text-white/60 hover:text-[#FFD369] transition-colors">
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="#" className="text-white/60 hover:text-[#FFD369] transition-colors">Help Center</a>
            <span className="text-white/40">•</span>
            <a href="#" className="text-white/60 hover:text-[#FFD369] transition-colors">Contact Us</a>
            <span className="text-white/40">•</span>
            <a href="#" className="text-white/60 hover:text-[#FFD369] transition-colors">Privacy</a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
