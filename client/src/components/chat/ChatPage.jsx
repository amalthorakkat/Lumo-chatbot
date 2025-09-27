import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import History from "./History";
import ChatWindow from "./ChatWindow";
import { setSessions, setCurrentSession } from "../../redux/slices/chatSlice";
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
        const response = await api.get("/chat/sessions");
        const sessions = response.data;
        dispatch(setSessions(sessions));
        if (sessions.length > 0) {
          dispatch(
            setCurrentSession({
              sessionId: sessions[0]._id,
              messages: sessions[0].messages,
            })
          );
        } else {
          await createNewSession();
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.error("Fetch Sessions Error: Unauthorized. Logging out.");
          dispatch(logout());
          navigate("/login");
        } else {
          setError("Failed to load chat sessions.");
          console.error("Fetch Sessions Error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [dispatch, isAuthenticated, navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <History />
      <div className="flex-1 flex justify-center overflow-y-auto transition-all duration-300">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4 max-w-4xl mx-auto">
            {error}
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto">
            <ChatWindow />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
