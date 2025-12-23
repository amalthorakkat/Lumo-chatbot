import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Key,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import api from "../../utils/api";
import { setCredentials } from "../../redux/slices/authSlice";
import LOGO from "../../assets/LOGO.png";

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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-card rounded-2xl p-8 border-t border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 mb-6 shadow-lg shadow-indigo-500/30">
              {/* Use a clear specific icon instead of image if possible, but keeping logo as requested */}
              <img
                src={LOGO}
                className="h-10 w-auto brightness-200"
                alt="Logo"
              />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {step === 1 ? "Welcome Back" : "Security Verification"}
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              {step === 1
                ? "Sign in to continue to Lumo"
                : "We sent a code to your email"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-slide-in">
              <div className="p-1 bg-red-500/20 rounded-full">
                <span className="block w-1.5 h-1.5 bg-red-500 rounded-full" />
              </div>
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  Email or Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="glass-input w-full pl-11 pr-4 py-3.5 rounded-xl outline-none"
                    placeholder="name@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full pl-11 pr-11 py-3.5 rounded-xl outline-none"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <span className="text-xs font-medium">Hide</span>
                    ) : (
                      <span className="text-xs font-medium">Show</span>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="glass-button w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 group mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Verification Code
                  </label>
                  <span className="text-xs text-indigo-400 font-medium font-mono bg-indigo-500/10 px-2 py-0.5 rounded">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="glass-input w-full pl-11 pr-4 py-3.5 rounded-xl outline-none text-center tracking-[0.5em] text-lg font-mono font-bold"
                    placeholder="000000"
                    required
                    disabled={loading}
                    maxLength={6}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-center text-slate-500">
                  Sent to{" "}
                  <span className="text-slate-300 font-medium">{email}</span>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="glass-button w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Login</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-all"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
