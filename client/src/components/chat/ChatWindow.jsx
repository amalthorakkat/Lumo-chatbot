// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { User, Bot } from "lucide-react";
// import api from "../../utils/api";
// import {
//   addMessage,
//   setLoading,
//   updateSessionTitle,
// } from "../../redux/slices/chatSlice";
// import { logout } from "../../redux/slices/authSlice";

// const ChatWindow = () => {
//   const [input, setInput] = useState("");
//   const messages = useSelector((state) => state.chat.messages);
//   const loading = useSelector((state) => state.chat.loading);
//   const currentSessionId = useSelector((state) => state.chat.currentSessionId);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     const userMessage = input.trim();
//     if (!userMessage || !currentSessionId) return;

//     dispatch(addMessage({ sender: "user", text: userMessage }));
//     dispatch(setLoading(true));
//     setInput("");

//     try {
//       const response = await api.post("/chat/message", {
//         message: userMessage,
//         sessionId: currentSessionId,
//       });
//       dispatch(addMessage({ sender: "bot", text: response.data.reply }));
//       dispatch(
//         updateSessionTitle({
//           sessionId: currentSessionId,
//           title: response.data.title,
//         })
//       );
//     } catch (err) {
//       if (err.response?.status === 401) {
//         dispatch(
//           addMessage({
//             sender: "bot",
//             text: "Session expired. Please log in again.",
//           })
//         );
//         dispatch(logout());
//         navigate("/login");
//         return;
//       }
//       if (err.response?.status === 503 || err.response?.status === 500) {
//         dispatch(
//           addMessage({
//             sender: "bot",
//             text: err.response.data.message,
//           })
//         );
//         dispatch(
//           updateSessionTitle({
//             sessionId: currentSessionId,
//             title: err.response.data.title,
//           })
//         );
//       } else if (err.response?.status === 404) {
//         dispatch(
//           addMessage({
//             sender: "bot",
//             text: "The AI model is not available. Your message has been saved.",
//           })
//         );
//         dispatch(
//           updateSessionTitle({
//             sessionId: currentSessionId,
//             title: err.response.data.title,
//           })
//         );
//       } else {
//         dispatch(
//           addMessage({
//             sender: "bot",
//             text:
//               err.response?.data?.message || "Error: Could not get response.",
//           })
//         );
//       }
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen w-full bg-white shadow-lg md:rounded-lg">
//       <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
//         {currentSessionId ? (
//           messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`flex items-start gap-3 mb-4 ${
//                 msg.sender === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               {msg.sender === "bot" && (
//                 <Bot size={24} className="text-blue-500 flex-shrink-0 mt-1" />
//               )}
//               <div
//                 className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
//                   msg.sender === "user"
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 <div className="text-sm">{msg.text}</div>
//                 {msg.createdAt && (
//                   <div className="text-xs text-gray-500 mt-1">
//                     {new Date(msg.createdAt).toLocaleTimeString()}
//                   </div>
//                 )}
//               </div>
//               {msg.sender === "user" && (
//                 <User size={24} className="text-blue-500 flex-shrink-0 mt-1" />
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-gray-500 py-8">
//             <div className="animate-spin mx-auto h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
//             Select a chat session or start a new chat.
//           </div>
//         )}
//         {loading && (
//           <div className="flex justify-start items-center gap-2">
//             <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full"></div>
//             <span className="text-gray-500 text-sm">Bot is typing...</span>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <form
//         onSubmit={handleSend}
//         className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6"
//       >
//         <div className="flex items-center gap-2 w-full">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             placeholder={
//               currentSessionId ? "Type a message..." : "Waiting for session..."
//             }
//             disabled={loading || !currentSessionId}
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 transition duration-200"
//             disabled={loading || !input.trim() || !currentSessionId}
//           >
//             Send
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatWindow;

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Bot, Send, Sparkles, Loader2 } from "lucide-react";
import api from "../../utils/api";
import {
  addMessage,
  setLoading,
  updateSessionTitle,
} from "../../redux/slices/chatSlice";
import { logout } from "../../redux/slices/authSlice";
import LOGO from "../../assets/LOGO.png";

const LOGO_URL = LOGO;

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const messages = useSelector((state) => state.chat.messages);
  const loading = useSelector((state) => state.chat.loading);
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!input && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input]);

  const handleSend = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || !currentSessionId) return;

    dispatch(addMessage({ sender: "user", text: userMessage }));
    dispatch(setLoading(true));
    setInput("");

    try {
      console.log(
        `Sending message: sessionId=${currentSessionId}, message=${userMessage}`
      );
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
      console.error("Send Message Error:", err);
      let errorMessage = "Error: Could not get response.";
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = "Session expired. Please log in again.";
            dispatch(logout());
            navigate("/login");
            break;
          case 403:
            errorMessage =
              "Unauthorized: This chat session does not belong to you. Starting a new session.";
            try {
              const response = await api.post("/chat/new");
              dispatch(
                setCurrentSession({
                  sessionId: response.data.sessionId,
                  messages: [],
                })
              );
              dispatch(
                updateSessionTitle({
                  sessionId: response.data.sessionId,
                  title: response.data.title,
                })
              );
            } catch (newSessionErr) {
              errorMessage =
                "Failed to start a new session. Please try logging out and back in.";
            }
            break;
          case 404:
            errorMessage = "Session not found. Please start a new chat.";
            break;
          case 500:
            errorMessage =
              err.response.data.message || "Server error. Please try again.";
            break;
          case 503:
            errorMessage =
              err.response.data.message ||
              "Service temporarily unavailable. Your message has been saved.";
            break;
          default:
            errorMessage =
              err.response.data.message || "An unexpected error occurred.";
        }
      }
      dispatch(addMessage({ sender: "bot", text: errorMessage }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header - Mobile Only (or sticky header if needed) */}
      <div className="sticky top-0 z-20 md:hidden bg-slate-950/80 backdrop-blur-md border-b border-white/5 p-4">
        <div className="flex items-center justify-center">
          <h2 className="text-lg font-bold text-white">Lumo Chat</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent">
        <div className="max-w-3xl mx-auto space-y-6">
          {currentSessionId ? (
            <>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 animate-fade-in">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                    <Sparkles size={32} className="text-indigo-400" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="text-2xl font-bold text-white">
                      How can I help you today?
                    </h3>
                    <p className="text-slate-400">
                      I can help you with writing, analysis, code, and more.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-8">
                    {[
                      "Write a creative story",
                      "Explain quantum physics",
                      "Debug my React code",
                      "Plan a trip to Japan",
                    ].map((text) => (
                      <button
                        key={text}
                        onClick={() => setInput(text)}
                        className="text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all text-sm text-slate-300 hover:text-white"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 animate-slide-in ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row "
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                      msg.sender === "user"
                        ? "bg-indigo-600 ring-2 ring-indigo-500/30"
                        : "bg-slate-800 ring-2 ring-white/10"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-indigo-400" />
                    )}
                  </div>

                  <div
                    className={`relative max-w-[80%] px-5 py-3.5 rounded-2xl shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm"
                        : "bg-white/10 backdrop-blur-md border border-white/5 text-slate-200 rounded-tl-sm"
                    }`}
                  >
                    <div className="text-base leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                    <div
                      className={`text-[10px] mt-1.5 opacity-60 font-medium ${
                        msg.sender === "user"
                          ? "text-indigo-100"
                          : "text-slate-500"
                      }`}
                    >
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              <Loader2 size={24} className="animate-spin text-indigo-500" />
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <Bot size={16} className="text-indigo-400" />
              </div>
              <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                <span
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur"></div>
          <div className="relative flex items-end gap-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              className="w-full max-h-32 min-h-[48px] px-4 py-3 bg-transparent border-0 resize-none focus:outline-none text-slate-200 placeholder-slate-500 text-base leading-relaxed scrollbar-thin scrollbar-thumb-slate-700"
              placeholder={
                currentSessionId ? "Message Lumo..." : "Initializing..."
              }
              disabled={loading || !currentSessionId}
              rows={1}
              style={{ height: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 150) + "px";
              }}
            />
            <button
              onClick={handleSend}
              className="mb-1 mr-1 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              disabled={loading || !input.trim() || !currentSessionId}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <div className="text-center mt-2.5">
            <p className="text-[10px] text-slate-500">
              Lumo can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
