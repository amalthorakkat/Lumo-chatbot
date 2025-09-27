import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { addMessage, setLoading } from "../../redux/slices/chatSlice";
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
      if (err.response?.status === 503) {
        dispatch(
          addMessage({
            sender: "bot",
            text: "The AI service is temporarily unavailable. Your message has been saved.",
          })
        );
      } else if (err.response?.status === 404) {
        dispatch(
          addMessage({
            sender: "bot",
            text: "The AI model is not available. Your message has been saved.",
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
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto bg-white shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {currentSessionId ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <div>{msg.text}</div>
                {msg.createdAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            <div className="animate-spin mx-auto h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
            Select a chat session or start a new chat.
          </div>
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full mr-2"></div>
            Bot is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              currentSessionId ? "Type a message..." : "Waiting for session..."
            }
            disabled={loading || !currentSessionId}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-gray-400"
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
