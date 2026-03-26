import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, UserCircle, Shield, Truck, Sparkles } from "lucide-react";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (
      role === "admin" &&
      email === "admin@ecoroute.com" &&
      password === "admin123"
    ) {
      login("admin", "Admin User");
      navigate("/dashboard");
    } else if (
      role === "driver" &&
      email === "driver@ecoroute.com" &&
      password === "driver123"
    ) {
      login("driver", "David Rodriguez");
      navigate("/driver");
    } else {
      setError("Invalid credentials. Please check your email and password.");
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    if (role === "admin") {
      setEmail("admin@ecoroute.com");
      setPassword("admin123");
    } else {
      setEmail("driver@ecoroute.com");
      setPassword("driver123");
    }
    setError("");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
        }}
      />
      
      {/* Dynamic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-blue-900/30" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 15}s`,
              opacity: Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
          
          {/* Decorative Top Bar */}
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="p-8">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse" />
                 <div className="relative w-24 h-24 flex items-center justify-center">
  
  {/* Glow Effect */}
  <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full opacity-60 animate-pulse"></div>

  {/* Logo */}
  <img
    src={logo}
    alt="EcoRoute"
    className="relative w-20 h-20 object-cover object-center scale-150 rounded-xl shadow-xl bg-white/10 p-1"
  />
</div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                EcoRoute
              </h1>
              <p className="text-gray-300 text-sm flex items-center justify-center gap-1">
                Intelligent Delivery Optimizer
                <span className="text-xs">✨</span>
              </p>
            </div>

            {/* Role Toggle - Enhanced */}
            <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-300 ${
                  role === "admin"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Shield size={18} />
                <span className="font-medium">Admin Portal</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("driver");
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-300 ${
                  role === "driver"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Truck size={18} />
                <span className="font-medium">Driver Portal</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="relative group">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  emailFocused || email ? "text-blue-400" : "text-gray-400"
                }`}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="Enter Email Address"
                  className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  passwordFocused || password ? "text-purple-400" : "text-gray-400"
                }`}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Enter Password"
                  className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border-l-4 border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm animate-shake flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <UserCircle size={18} />
                      Sign In to {role === "admin" ? "Admin" : "Driver"} Portal
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={fillDemoCredentials}
                className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 group"
              >
                <span className="text-lg group-hover:animate-pulse">⚡</span>
                Quick Login with Demo Credentials
                <span className="text-lg group-hover:animate-pulse">⚡</span>
              </button>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => {
                  setRole("admin");
                  fillDemoCredentials();
                }}>
                  <p className="text-blue-400 text-xs font-semibold mb-1">ADMIN</p>
                  <p className="text-gray-400 text-[10px]">admin@ecoroute.com</p>
                  <p className="text-gray-400 text-[10px]">••••••••</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer" onClick={() => {
                  setRole("driver");
                  fillDemoCredentials();
                }}>
                  <p className="text-purple-400 text-xs font-semibold mb-1">DRIVER</p>
                  <p className="text-gray-400 text-[10px]">driver@ecoroute.com</p>
                  <p className="text-gray-400 text-[10px]">••••••••</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-xs">
            © 2024 EcoRoute - Intelligent Delivery System
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;