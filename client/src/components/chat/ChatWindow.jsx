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

// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { User, Bot, Send, Sparkles } from "lucide-react";
// import api from "../../utils/api";
// import {
//   addMessage,
//   setLoading,
//   updateSessionTitle,
// } from "../../redux/slices/chatSlice";
// import { logout } from "../../redux/slices/authSlice";

// const LOGO_URL =
//   "https://i.postimg.cc/RhqzpXz5/Gemini-Generated-Image-kyplvxkyplvxkypl-1.png";

// const ChatWindow = () => {
//   const [input, setInput] = useState("");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const messages = useSelector((state) => state.chat.messages);
//   const loading = useSelector((state) => state.chat.loading);
//   const currentSessionId = useSelector((state) => state.chat.currentSessionId);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (!input && textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//     }
//   }, [input]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     const userMessage = input.trim();
//     if (!userMessage || !currentSessionId) return;

//     dispatch(addMessage({ sender: "user", text: userMessage }));
//     dispatch(setLoading(true));
//     setInput("");

//     try {
//       console.log(
//         `Sending message: sessionId=${currentSessionId}, message=${userMessage}`
//       );
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
//       console.error("Send Message Error:", err);
//       if (err.response?.status === 401) {
//         dispatch(
//           addMessage({
//             sender: "bot",
//             text: "Session expired. Please log in again.",
//           })
//         );
//         dispatch(logout());
//         navigate("/login");
//       } else if (err.response?.status === 403) {
//         dispatch(
//           addMessage({
//             sender: "bot",
//             text: "Unauthorized: This chat session does not belong to you. Starting a new session.",
//           })
//         );
//         // Optionally, trigger a new session creation
//         try {
//           const response = await api.post("/chat/new");
//           dispatch(
//             setCurrentSession({
//               sessionId: response.data.sessionId,
//               messages: [],
//             })
//           );
//           dispatch(
//             updateSessionTitle({
//               sessionId: response.data.sessionId,
//               title: response.data.title,
//             })
//           );
//         } catch (newSessionErr) {
//           dispatch(
//             addMessage({
//               sender: "bot",
//               text: "Failed to start a new session. Please try logging out and back in.",
//             })
//           );
//         }
//       } else if (err.response?.status === 404) {
//         dispatch(
//           addMessage({
//             sender: "bot",
//             text: "Session not found. Please start a new chat.",
//           })
//         );
//       } else if (err.response?.status === 503 || err.response?.status === 500) {
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
//     <div className="flex flex-col h-full bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl">
//       <div className="sticky top-0 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-lg border-b border-white/30 p-2 sm:p-4 z-10">
//         <div className="flex items-center justify-center">
//           {isMobile ? (
//             <div className="flex items-center justify-center group">
//               <div className="relative">
//                 <img
//                   src={LOGO_URL}
//                   className="h-12 transition-transform duration-300 group-hover:scale-110"
//                   alt="Logo"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
//                   <Bot size={20} className="text-white" />
//                 </div>
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-lg animate-pulse"></div>
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-800">
//                   AI Assistant
//                 </h2>
//                 <p className="text-sm text-slate-500">
//                   {loading ? "Thinking..." : "Ready to help"}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex-1 p-2 sm:p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
//         {currentSessionId ? (
//           <>
//             {messages.length === 0 && (
//               <div className="flex flex-col items-center justify-center h-full space-y-2 sm:space-y-4 text-center">
//                 <div className="relative">
//                   <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
//                     <Sparkles
//                       size={32}
//                       className="text-blue-500 animate-pulse"
//                     />
//                   </div>
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-xl animate-pulse"></div>
//                 </div>
//                 <div className="space-y-1 sm:space-y-2">
//                   <h3 className="text-xl font-semibold text-slate-800">
//                     Start a conversation
//                   </h3>
//                   <p className="text-slate-500 max-w-md">
//                     Ask me anything! I'm here to help with questions, creative
//                     tasks, analysis, and more.
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-[95%] sm:max-w-lg w-full">
//                   {[
//                     "💡 Creative brainstorming",
//                     "📊 Data analysis help",
//                     "✍️ Writing assistance",
//                     "🔍 Research support",
//                   ].map((suggestion, index) => (
//                     <div
//                       key={index}
//                       className="p-2 sm:p-3 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-sm text-slate-600"
//                       onClick={() =>
//                         setInput(suggestion.split(" ").slice(1).join(" "))
//                       }
//                     >
//                       {suggestion}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex items-start gap-2 sm:gap-3 mb-2 sm:mb-4 animate-fadeIn ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//                 style={{
//                   animationDelay: `${index * 100}ms`,
//                   animation: "fadeInUp 0.5s ease-out forwards",
//                 }}
//               >
//                 {msg.sender === "bot" && (
//                   <div className="relative flex-shrink-0">
//                     <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
//                       <Bot size={16} className="text-white" />
//                     </div>
//                     <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-md animate-pulse"></div>
//                   </div>
//                 )}

//                 <div
//                   className={`group relative max-w-[90%] sm:max-w-[75%] transition-all duration-300 ${
//                     msg.sender === "user"
//                       ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                       : "bg-white/80 backdrop-blur-sm text-slate-800 shadow-lg hover:shadow-xl border border-white/40 hover:bg-white/90 transform hover:-translate-y-0.5"
//                   } rounded-2xl overflow-hidden`}
//                 >
//                   {msg.sender === "user" && (
//                     <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   )}
//                   <div className="p-2 sm:p-4 relative z-10">
//                     <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
//                       {msg.text}
//                     </div>
//                     {msg.createdAt && (
//                       <div
//                         className={`text-xs mt-1 sm:mt-2 opacity-70 ${
//                           msg.sender === "user"
//                             ? "text-blue-100"
//                             : "text-slate-500"
//                         }`}
//                       >
//                         {new Date(msg.createdAt).toLocaleTimeString()}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {msg.sender === "user" && (
//                   <div className="relative flex-shrink-0">
//                     <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
//                       <User size={16} className="text-white" />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-full space-y-2 sm:space-y-4">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//               <div
//                 className="w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin absolute top-0 left-0"
//                 style={{
//                   animationDirection: "reverse",
//                   animationDuration: "1.5s",
//                 }}
//               ></div>
//             </div>
//             <div className="text-center space-y-1 sm:space-y-2">
//               <div className="text-slate-600 font-medium">
//                 Preparing your chat session...
//               </div>
//               <div className="flex space-x-1 justify-center">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
//                 <div
//                   className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//                   style={{ animationDelay: "0.1s" }}
//                 ></div>
//                 <div
//                   className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//                   style={{ animationDelay: "0.2s" }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         )}

//         {loading && (
//           <div className="flex justify-start items-center gap-2 sm:gap-3 mb-2 sm:mb-4 animate-fadeIn">
//             <div className="relative">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
//                 <Bot size={16} className="text-white" />
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-md animate-pulse"></div>
//             </div>
//             <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-4 rounded-2xl shadow-lg border border-white/40 max-w-[90%] sm:max-w-[75%]">
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
//                   <div
//                     className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//                     style={{ animationDelay: "0.1s" }}
//                   ></div>
//                   <div
//                     className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//                     style={{ animationDelay: "0.2s" }}
//                   ></div>
//                 </div>
//                 <span className="text-slate-600 text-sm font-medium">
//                   Lumo is thinking...
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <form
//         onSubmit={handleSend}
//         className="sticky bottom-0 bg-gradient-to-t from-white/95 to-white/80 backdrop-blur-lg border-t border-white/30 p-2 sm:p-4"
//       >
//         <div className="relative max-w-[95%] sm:max-w-4xl mx-auto">
//           <div className="relative flex items-end gap-1 sm:gap-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-white/40 p-1.5 sm:p-3 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-300 transition-all duration-300">
//             <div className="flex-1 relative">
//               <textarea
//                 ref={textareaRef}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSend(e);
//                   }
//                 }}
//                 className="w-full max-h-24 sm:max-h-32 min-h-[36px] sm:min-h-[44px] px-2 sm:px-4 py-1.5 sm:py-3 bg-transparent border-0 resize-none focus:outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base leading-relaxed"
//                 placeholder={
//                   currentSessionId
//                     ? "Type your message..."
//                     : "Waiting for session..."
//                 }
//                 disabled={loading || !currentSessionId}
//                 rows={1}
//                 style={{
//                   minHeight: isMobile ? "36px" : "44px",
//                   height: "auto",
//                   maxHeight: isMobile ? "96px" : "128px",
//                 }}
//                 onInput={(e) => {
//                   e.target.style.height = "auto";
//                   e.target.style.height = `${Math.min(
//                     e.target.scrollHeight,
//                     isMobile ? 96 : 128
//                   )}px`;
//                 }}
//               />
//             </div>
//             <button
//               type="submit"
//               className="group relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:hover:translate-y-0 disabled:hover:shadow-lg overflow-hidden cursor-pointer"
//               disabled={loading || !input.trim() || !currentSessionId}
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300"></div>
//               <div className="relative z-10 flex items-center justify-center w-full h-full">
//                 {loading ? (
//                   <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                 ) : (
//                   <Send
//                     size={isMobile ? 16 : 18}
//                     className="transition-transform duration-300 group-hover:scale-110 group-disabled:scale-100"
//                   />
//                 )}
//               </div>
//             </button>
//           </div>
//           <div className="flex justify-between items-center mt-1 sm:mt-2">
//             {input && (
//               <span className="text-xs text-slate-400">
//                 {input.length} characters
//               </span>
//             )}
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatWindow;


import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Bot, Send, Sparkles } from "lucide-react";
import api from "../../utils/api";
import {
  addMessage,
  setLoading,
  updateSessionTitle,
} from "../../redux/slices/chatSlice";
import { logout } from "../../redux/slices/authSlice";

const LOGO_URL =
  "https://i.postimg.cc/RhqzpXz5/Gemini-Generated-Image-kyplvxkyplvxkypl-1.png";

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
      if (err.response?.status === 401) {
        dispatch(
          addMessage({
            sender: "bot",
            text: "Session expired. Please log in again.",
          })
        );
        dispatch(logout());
        navigate("/login");
      } else if (err.response?.status === 403) {
        dispatch(
          addMessage({
            sender: "bot",
            text: "Unauthorized: This chat session does not belong to you. Starting a new session.",
          })
        );
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
          dispatch(
            addMessage({
              sender: "bot",
              text: "Failed to start a new session. Please try logging out and back in.",
            })
          );
        }
      } else if (err.response?.status === 404) {
        dispatch(
          addMessage({
            sender: "bot",
            text: "Session not found. Please start a new chat.",
          })
        );
      } else if (err.response?.status === 503 || err.response?.status === 500) {
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
    <div className="flex flex-col h-full bg-gray-50 font-sans">
      <div className="sticky top-0 bg-white shadow-sm border-b border-gray-100 p-4 z-10">
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          {isMobile ? (
            <div className="flex items-center justify-center w-full">
              <div className="relative">
                <img
                  src={LOGO_URL}
                  className="h-12 w-auto max-w-[120px] object-contain transition-transform duration-300 hover:scale-105"
                  alt="Logo"
                  style={{ display: "block" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-300/20 to-blue-300/20 rounded-full blur-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Bot size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  AI Assistant
                </h2>
                <p className="text-sm text-gray-500">
                  {loading ? "Processing..." : "Ready to assist"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isMobile ? 'pb-24' : 'pb-6'}`}>
        {currentSessionId ? (
          <>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[600px] space-y-4 text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center shadow-sm">
                    <Sparkles
                      size={28}
                      className="text-indigo-600 animate-pulse"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Start a conversation
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Ask anything! I'm here to assist with questions, creative tasks, analysis, and more.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                  {[
                    "💡 Creative brainstorming",
                    "📊 Data analysis help",
                    "✍️ Writing assistance",
                    "🔍 Research support",
                  ].map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-indigo-50/50 cursor-pointer transition-all duration-300 text-sm text-gray-700 hover:text-indigo-700"
                      onClick={() =>
                        setInput(suggestion.split(" ").slice(1).join(" "))
                      }
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 mb-4 animate-fadeIn ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.4s ease-out forwards",
                }}
              >
                {msg.sender === "bot" && (
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <Bot size={16} className="text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`group relative max-w-[80%] rounded-lg shadow-sm transition-all duration-300 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white"
                      : "bg-white text-gray-800 border border-gray-100"
                  } hover:shadow-md`}
                >
                  <div className="p-4">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </div>
                    {msg.createdAt && (
                      <div
                        className={`text-xs mt-2 opacity-70 ${
                          msg.sender === "user"
                            ? "text-indigo-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center shadow-md">
                      <User size={16} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-gray-600 font-medium">
                Preparing your chat session...
              </div>
              <div className="flex space-x-1 justify-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-start items-center gap-3 mb-4 animate-fadeIn">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Bot size={16} className="text-white" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 max-w-[80%]">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  Lumo is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={`${isMobile ? 'fixed bottom-0 left-0 right-0' : 'sticky bottom-0'} bg-white border-t border-gray-100 p-4 sm:p-6 z-20`}>
        <div className="relative max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-300 transition-all duration-300">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              className="w-full max-h-32 min-h-[48px] px-4 py-3 bg-transparent border-0 resize-none focus:outline-none text-gray-800 placeholder-gray-400 text-base leading-relaxed font-medium"
              placeholder={
                currentSessionId
                  ? "Type your message..."
                  : "Waiting for session..."
              }
              disabled={loading || !currentSessionId}
              rows={1}
              style={{
                minHeight: "48px",
                height: "auto",
                maxHeight: "128px",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  128
                )}px`;
              }}
            />
            <button
              type="submit"
              onClick={handleSend}
              className="group relative flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={loading || !input.trim() || !currentSessionId}
            >
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send
                    size={18}
                    className="transition-transform duration-300 group-hover:scale-110 group-disabled:scale-100"
                  />
                )}
              </div>
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            {input && (
              <span className="text-xs text-gray-400">
                {input.length} characters
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;