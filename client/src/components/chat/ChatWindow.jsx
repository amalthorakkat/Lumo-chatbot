import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Bot } from "lucide-react";
import api from "../../utils/api";
import {
  addMessage,
  setLoading,
  updateSessionTitle,
} from "../../redux/slices/chatSlice";
import { logout } from "../../redux/slices/authSlice";

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const messages = useSelector((state) => state.chat.messages);
  const loading = useSelector((state) => state.chat.loading);
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || !currentSessionId) return;

    dispatch(addMessage({ sender: "user", text: userMessage }));
    dispatch(setLoading(true));
    setInput("");

    try {
      const response = await api.post("/chat/message", {
        message: userMessage,
        sessionId: currentSessionId,
      });
      dispatch(addMessage({ sender: "bot", text: response.data.reply }));
      dispatch(
        updateSessionTitle({
          sessionId: currentSessionId,
          title: response.data.title,
        })
      );
    } catch (err) {
      if (err.response?.status === 401) {
        dispatch(
          addMessage({
            sender: "bot",
            text: "Session expired. Please log in again.",
          })
        );
        dispatch(logout());
        navigate("/login");
        return;
      }
      if (err.response?.status === 503 || err.response?.status === 500) {
        dispatch(
          addMessage({
            sender: "bot",
            text: err.response.data.message,
          })
        );
        dispatch(
          updateSessionTitle({
            sessionId: currentSessionId,
            title: err.response.data.title,
          })
        );
      } else if (err.response?.status === 404) {
        dispatch(
          addMessage({
            sender: "bot",
            text: "The AI model is not available. Your message has been saved.",
          })
        );
        dispatch(
          updateSessionTitle({
            sessionId: currentSessionId,
            title: err.response.data.title,
          })
        );
      } else {
        dispatch(
          addMessage({
            sender: "bot",
            text:
              err.response?.data?.message || "Error: Could not get response.",
          })
        );
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white shadow-lg md:rounded-lg">
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {currentSessionId ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 mb-4 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <Bot size={24} className="text-blue-500 flex-shrink-0 mt-1" />
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="text-sm">{msg.text}</div>
                {msg.createdAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
              {msg.sender === "user" && (
                <User size={24} className="text-blue-500 flex-shrink-0 mt-1" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <div className="animate-spin mx-auto h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
            Select a chat session or start a new chat.
          </div>
        )}
        {loading && (
          <div className="flex justify-start items-center gap-2">
            <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-gray-500 text-sm">Bot is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder={
              currentSessionId ? "Type a message..." : "Waiting for session..."
            }
            disabled={loading || !currentSessionId}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
            disabled={loading || !input.trim() || !currentSessionId}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
