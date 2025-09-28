// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../../utils/api";
// import { setCredentials } from "../../redux/slices/authSlice";
// import LOGO from "../../assets/LOGO.png";
// import BG from "../../assets/bg.jpg"

// const SignUp = () => {
//   const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [name, setName] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (step === 2 && timeLeft > 0) {
//       const timer = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     } else if (step === 2 && timeLeft === 0) {
//       setError("OTP expired. Please try again.");
//       setStep(1);
//       setOtp("");
//     }
//   }, [step, timeLeft]);

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const handleCredentialsSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       console.log("Signup Request:", { email, username, name, password }); // Debug log
//       await api.post("/auth/signup", { email, password, username, name });
//       console.log("Signup successful, OTP sent to:", email); // Debug log
//       setStep(2);
//       setTimeLeft(600);
//     } catch (err) {
//       console.error("Signup Error:", err.response?.data);
//       setError(err.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOTPSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const response = await api.post("/auth/verify-otp-signup", {
//         email,
//         otp,
//       });
//       const token = response.data.token;
//       console.log("Signup OTP Verification Response:", response.data); // Debug log
//       if (token) {
//         dispatch(setCredentials({ token }));
//         console.log("Token stored:", localStorage.getItem("token")); // Debug log
//         navigate("/chat");
//       }
//     } catch (err) {
//       console.error("Signup OTP Error:", err.response?.data); // Debug log
//       setError(err.response?.data?.message || "OTP verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <img src={LOGO} className="h-20 mx-auto mb-4" alt="Lumo" />
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           {step === 1 ? "Sign Up" : "Verify OTP"}
//         </h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         {step === 1 ? (
//           <form onSubmit={handleCredentialsSubmit}>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2" htmlFor="name">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2" htmlFor="username">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2" htmlFor="email">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <div className="mb-6">
//               <label className="block text-gray-700 mb-2" htmlFor="password">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 disabled={loading}
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
//               disabled={loading}
//             >
//               {loading ? "Sending OTP..." : "Send OTP"}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleOTPSubmit}>
//             <div className="mb-6">
//               <label className="block text-gray-700 mb-2" htmlFor="otp">
//                 Enter OTP sent to {email}
//               </label>
//               <input
//                 type="text"
//                 id="otp"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 disabled={loading}
//                 maxLength={6}
//               />
//               <p className="text-sm text-gray-500 mt-2">
//                 Time remaining: {formatTime(timeLeft)}
//               </p>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
//               disabled={loading}
//             >
//               {loading ? "Verifying..." : "Verify & Sign Up"}
//             </button>
//           </form>
//         )}
//         {step === 2 && (
//           <button
//             onClick={() => setStep(1)}
//             className="mt-2 text-blue-500 hover:underline text-sm"
//           >
//             Back to Credentials
//           </button>
//         )}
//         <p className="mt-4 text-center">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-500 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import { setCredentials } from "../../redux/slices/authSlice";
import LOGO from "../../assets/LOGO.png";
import BG from "../../assets/bg.jpg";

const SignUp = () => {
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
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
      console.log("Signup Request:", { email, username, name, password }); // Debug log
      await api.post("/auth/signup", { email, password, username, name });
      console.log("Signup successful, OTP sent to:", email); // Debug log
      setStep(2);
      setTimeLeft(600);
    } catch (err) {
      console.error("Signup Error:", err.response?.data);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/verify-otp-signup", {
        email,
        otp,
      });
      const token = response.data.token;
      console.log("Signup OTP Verification Response:", response.data); // Debug log
      if (token) {
        dispatch(setCredentials({ token }));
        console.log("Token stored:", localStorage.getItem("token")); // Debug log
        navigate("/chat");
      }
    } catch (err) {
      console.error("Signup OTP Error:", err.response?.data); // Debug log
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className=" flex items-center justify-center ">
            <img src={LOGO} className="h-15 mb-8" alt="Logo" />
          </div>

          {/* Header */}
          <div className="mb-8 text-center ">
            <p className="text-gray-600 text-sm mb-2">Start your journey</p>
            <h1 className="text-2xl font-semibold text-gray-900">
              {step === 1 ? "Sign Up to Lumo" : "Verify OTP"}
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your name"
                  required
                  disabled={loading}
                />
              </div>

              {/* Username Field */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Choose a username"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-2"
                  htmlFor="email"
                >
                  E-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
                    placeholder="example@email.com"
                    required
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26c.3.16.69.16 1 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-2"
                  htmlFor="password"
                >
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
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 mt-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              {/* OTP Field */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-2"
                  htmlFor="otp"
                >
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
                  Time remaining:{" "}
                  <span className="font-medium text-blue-600">
                    {formatTime(timeLeft)}
                  </span>
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
                  "Verify & Sign Up"
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

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Background Image */}
      <div className="flex-1 hidden sm:block relative overflow-hidden">
        <img src={BG} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
      </div>
    </div>
  );
};

export default SignUp;
