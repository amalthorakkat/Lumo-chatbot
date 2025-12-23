
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
  const currentSessionId = useSelector((state) => state.chat.currentSessionId); // Add this line
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
          // Check if currentSessionId is valid
          const currentSession = sessions.find(
            (s) => s._id === currentSessionId
          );
          if (currentSession) {
            dispatch(
              setCurrentSession({
                sessionId: currentSession._id,
                messages: currentSession.messages,
              })
            );
          } else {
            dispatch(
              setCurrentSession({
                sessionId: sessions[0]._id,
                messages: sessions[0].messages,
              })
            );
          }
        } else {
          console.log("No sessions found, creating new session");
          await createNewSession();
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
  }, [dispatch, isAuthenticated, navigate, currentSessionId]);

  return (
    <div className="flex h-screen overflow-hidden">
      <History />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
            <div className="text-slate-400 font-medium">
              Loading your conversations...
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-4 p-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
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
            <h3 className="text-xl font-semibold text-slate-200">
              Something went wrong
            </h3>
            <p className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="glass-button px-6 py-2 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        ) : (
          <ChatWindow />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
