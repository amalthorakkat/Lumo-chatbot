


import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import { setCredentials } from "../../redux/slices/authSlice";
import LOGO from "../../assets/LOGO.png";
import BG from "../../assets/bg.jpg";

const Login = () => {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // Store email from login response
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (step === 2 && timeLeft === 0) {
      setError("OTP expired. Please try again.");
      setStep(1);
      setOtp("");
    }
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { identifier, password });
      console.log("Login Response:", response.data); // Debug log
      setEmail(response.data.email);
      setStep(2);
      setTimeLeft(600);
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/verify-otp-login", { email, otp });
      const token = response.data.token;
      console.log("Login OTP Verification Response:", response.data); // Debug log
      if (token) {
        dispatch(setCredentials({ token }));
        console.log("Token stored:", localStorage.getItem("token")); // Debug log
        navigate("/chat");
      }
    } catch (err) {
      console.error("Login OTP Error:", err.response?.data); // Debug log
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Form Section */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 sm:p-8 w-full sm:w-1/2">
        <div className="w-full max-w-md px-4 sm:px-0">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img src={LOGO} className="h-12 w-auto" alt="Logo" />
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Welcome back</p>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {step === 1 ? "Sign in to Lumo" : "Verify OTP"}
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 sm:space-y-6">
              {/* Username/Email Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-2" htmlFor="identifier">
                  E-mail or Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
                    placeholder="example@email.com"
                    required
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 mt-4 sm:mt-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4 sm:space-y-6">
              {/* OTP Field */}
              <div>
                <label className="block text-sm text-gray-700 mb-2" htmlFor="otp">
                  Enter OTP sent to {email}
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                  placeholder="000000"
                  required
                  disabled={loading}
                  maxLength={6}
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Time remaining: <span className="font-medium text-blue-600">{formatTime(timeLeft)}</span>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify & Sign In"
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors duration-200"
              >
                Back to Credentials
              </button>
            </form>
          )}

          {/* Sign Up Link */}
          <p className="mt-6 sm:mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Background Image */}
      <div className="hidden sm:block sm:w-1/2 relative overflow-hidden">
        <img 
          src={BG} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
      </div>
    </div>
  );
};

export default Login;