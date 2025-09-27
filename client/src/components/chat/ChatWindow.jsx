import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { addMessage, setLoading } from "../../redux/slices/chatSlice";
import Message from "./Message";

const ChatWindow = () => {
  // Local input state
  const [input, setInput] = useState("");
  // Redux state
  const messages = useSelector((state) => state.chat.messages);
  const loading = useSelector((state) => state.chat.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle sending user message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message + set loading
    dispatch(addMessage({ sender: "user", text: input }));
    dispatch(setLoading(true));

    try {
      // Send to backend and add bot response
      const response = await api.post("/chat/message", { message: input });
      dispatch(addMessage({ sender: "bot", text: response.data.reply }));
    } catch (err) {
      console.error("Chat Error:", err.response?.data || err.message);

      // If token expired -> log out + redirect
      if (err.response?.status === 401) {
        const authError =
          err.response?.data?.message ||
          "Session expired. Please log in again.";
        dispatch(addMessage({ sender: "bot", text: authError }));
        dispatch(logout());
        navigate("/login");
        return;
      }

      // Other errors
      const errorMessage =
        err.response?.data?.message ||
        "Error: Could not get response. Check server logs.";
      dispatch(addMessage({ sender: "bot", text: errorMessage }));
    } finally {
      dispatch(setLoading(false));
      setInput(""); // Clear input
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto bg-white shadow-lg">
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-center">
            {/* Loading spinner */}
            <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Input + Send button */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            disabled={loading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
