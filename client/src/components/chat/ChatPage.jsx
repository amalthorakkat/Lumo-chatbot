// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import api from "../../utils/api";
// import History from "./History";
// import ChatWindow from "./ChatWindow";
// import { setSessions, setCurrentSession } from "../../redux/slices/chatSlice";
// import { logout } from "../../redux/slices/authSlice";

// const ChatPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const createNewSession = async (existingSessions = []) => {
//     try {
//       const response = await api.post("/chat/new");
//       const newSession = {
//         _id: response.data.sessionId,
//         title: response.data.title,
//         messages: [],
//       };
//       dispatch(setSessions([newSession, ...existingSessions]));
//       dispatch(setCurrentSession({ sessionId: newSession._id, messages: [] }));
//     } catch (error) {
//       console.error("Auto Create Session Error:", error);
//       setError("Failed to create a new chat session.");
//     }
//   };

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login");
//       return;
//     }

//     const fetchSessions = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const response = await api.get("/chat/sessions");
//         const sessions = response.data;
//         dispatch(setSessions(sessions));
//         if (sessions.length > 0) {
//           dispatch(
//             setCurrentSession({
//               sessionId: sessions[0]._id,
//               messages: sessions[0].messages,
//             })
//           );
//         } else {
//           await createNewSession();
//         }
//       } catch (error) {
//         if (error.response?.status === 401) {
//           console.error("Fetch Sessions Error: Unauthorized. Logging out.");
//           dispatch(logout());
//           navigate("/login");
//         } else {
//           setError("Failed to load chat sessions.");
//           console.error("Fetch Sessions Error:", error);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSessions();
//   }, [dispatch, isAuthenticated, navigate]);

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-100">
//       <History />
//       <div className="flex-1 flex justify-center overflow-y-auto transition-all duration-300">
//         {loading ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
//           </div>
//         ) : error ? (
//           <div className="text-center text-red-500 p-4 max-w-4xl mx-auto">
//             {error}
//           </div>
//         ) : (
//           <div className="w-full max-w-4xl mx-auto">
//             <ChatWindow />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import History from "./History";
import ChatWindow from "./ChatWindow";
import {
  setSessions,
  setCurrentSession,
  updateSessionTitle,
  clearMessages,
} from "../../redux/slices/chatSlice";
import { logout } from "../../redux/slices/authSlice";

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const createNewSession = async (existingSessions = []) => {
    try {
      const response = await api.post("/chat/new");
      const newSession = {
        _id: response.data.sessionId,
        title: response.data.title,
        messages: [],
      };
      dispatch(setSessions([newSession, ...existingSessions]));
      dispatch(setCurrentSession({ sessionId: newSession._id, messages: [] }));
    } catch (error) {
      console.error("Auto Create Session Error:", error);
      setError("Failed to create a new chat session.");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchSessions = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching sessions for user");
        const response = await api.get("/chat/sessions");
        const sessions = response.data;
        console.log("Fetched sessions:", sessions);
        dispatch(setSessions(sessions));
        if (sessions.length > 0) {
          dispatch(
            setCurrentSession({
              sessionId: sessions[0]._id,
              messages: sessions[0].messages,
            })
          );
        } else {
          console.log("No sessions found, creating new session");
          const newSessionResponse = await api.post("/chat/new");
          console.log("New session created:", newSessionResponse.data);
          const newSession = {
            _id: newSessionResponse.data.sessionId,
            title: newSessionResponse.data.title,
            messages: [],
          };
          dispatch(setSessions([newSession])); // Update sessions with the new session
          dispatch(
            setCurrentSession({
              sessionId: newSessionResponse.data.sessionId,
              messages: [],
            })
          );
        }
      } catch (error) {
        console.error("Fetch Sessions Error:", error);
        if (error.response?.status === 401) {
          dispatch(logout());
          navigate("/login");
        } else {
          setError(
            "Failed to load chat sessions: " +
              (error.response?.data?.message || "Unknown error")
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [dispatch, isAuthenticated, navigate]);

  return (
    <div className="flex h-screen overflow-hidden notebook-bg">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <History />

      <div className="flex-1 flex justify-center overflow-y-auto transition-all duration-300 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 md:p-8 p-2">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div
                className="w-16 h-16470px border-4 border-transparent border-t-indigo-400 rounded-full animate-spin absolute top-0 left-0"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
            <div className="text-slate-600 font-medium">
              Loading your conversations...
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-4 md:p-8 p-2">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">
              Something went wrong
            </h3>
            <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg md:px-4 md:py-3 px-2 py-1.5">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="md:px-6 md:py-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto md:p-4 sm:p-1">
            <div className="backdrop-blur-sm bg-white/80 sm:rounded-2xl shadow-xl border border-white/20 overflow-hidden h-full">
              <ChatWindow />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
