import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg shadow-lg w-full max-w-md">
        <img src={LOGO} className="h-20" alt="Lumo" />
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 ? "Login" : "Verify OTP"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {step === 1 ? (
          <form onSubmit={handleCredentialsSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="identifier">
                Username or Email
              </label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="otp">
                Enter OTP sent to {email}
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
                maxLength={6}
              />
              <p className="text-sm text-gray-500 mt-2">
                Time remaining: {formatTime(timeLeft)}
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="mt-2 text-blue-500 hover:underline text-sm"
          >
            Back to Credentials
          </button>
        )}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
