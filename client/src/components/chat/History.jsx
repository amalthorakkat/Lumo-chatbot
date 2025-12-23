// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { Plus, Trash2, Menu, Edit2, Sparkles, LogOut, X } from "lucide-react";
// import api from "../../utils/api";
// import {
//   setSessions,
//   setCurrentSession,
//   clearMessages,
// } from "../../redux/slices/chatSlice";
// import { logout } from "../../redux/slices/authSlice";
// import DeleteChatModal from "../modal/DeleteChatModal";

// const LOGO_URL =
//   "https://i.postimg.cc/RhqzpXz5/Gemini-Generated-Image-kyplvxkyplvxkypl-1.png";

// const History = () => {
//   const [isOpen, setIsOpen] = useState(false); // Always closed by default on mobile
//   const [loading, setLoading] = useState(false);
//   const [editingSessionId, setEditingSessionId] = useState(null);
//   const [newTitle, setNewTitle] = useState("");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [sessionToDelete, setSessionToDelete] = useState(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const sessions = useSelector((state) => state.chat.sessions);
//   const currentSessionId = useSelector((state) => state.chat.currentSessionId);
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
//   const sidebarRef = useRef(null);

//   // Close sidebar on outside click in mobile view
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         isOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target) &&
//         window.innerWidth < 768 // Mobile view
//       ) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

// const handleNewChat = async () => {
//   setLoading(true);
//   try {
//     console.log("Creating new chat session");
//     const response = await api.post("/chat/new");
//     const newSession = {
//       _id: response.data.sessionId,
//       title: response.data.title,
//       messages: [],
//     };
//     console.log("New session:", newSession);
//     dispatch(setSessions([newSession, ...sessions]));
//     dispatch(setCurrentSession({ sessionId: newSession._id, messages: [] }));
//     setIsOpen(false);
//   } catch (error) {
//     console.error("New Chat Error:", error);
//     alert("Failed to create new chat: " + (error.response?.data?.message || "Unknown error"));
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleSelectSession = (sessionId) => {
//     const session = sessions.find((s) => s._id === sessionId);
//     if (session) {
//       dispatch(setCurrentSession({ sessionId, messages: session.messages }));
//       setIsOpen(false);
//     }
//   };

//   const handleDeleteSession = async (sessionId) => {
//     setLoading(true);
//     try {
//       console.log(`Deleting session: ${sessionId}`);
//       await api.delete(`/chat/session/${sessionId}`);
//       const updatedSessions = sessions.filter((s) => s._id !== sessionId);
//       dispatch(setSessions(updatedSessions));
//       if (currentSessionId === sessionId) {
//         if (updatedSessions.length > 0) {
//           dispatch(
//             setCurrentSession({
//               sessionId: updatedSessions[0]._id,
//               messages: updatedSessions[0].messages,
//             })
//           );
//         } else {
//           await handleNewChat(); // Create a new session if none remain
//         }
//       }
//       setIsOpen(false);
//     } catch (error) {
//       console.error("Delete Session Error:", error);
//       if (error.response?.status === 401) {
//         dispatch(logout());
//         navigate("/login");
//       } else {
//         alert(
//           "Failed to delete session: " +
//             (error.response?.data?.message || "Unknown error")
//         );
//       }
//     } finally {
//       setLoading(false);
//       setShowDeleteModal(false);
//       setSessionToDelete(null);
//     }
//   };

//   const handleEditTitle = (sessionId, currentTitle) => {
//     setEditingSessionId(sessionId);
//     setNewTitle(currentTitle);
//   };

//   const handleSaveTitle = async (sessionId) => {
//     if (!newTitle.trim()) return;
//     setLoading(true);
//     try {
//       await api.put(`/chat/session/${sessionId}`, { title: newTitle.trim() });
//       const updatedSessions = sessions.map((s) =>
//         s._id === sessionId ? { ...s, title: newTitle.trim() } : s
//       );
//       dispatch(setSessions(updatedSessions));
//       setEditingSessionId(null);
//       setNewTitle("");
//       setIsOpen(false);
//     } catch (error) {
//       console.error("Edit Title Error:", error);
//       if (error.response?.status === 401) {
//         dispatch(logout());
//         navigate("/login");
//       } else {
//         alert(
//           "Failed to update title: " +
//             (error.response?.data?.message || "Unknown error")
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     dispatch(clearMessages());
//     navigate("/login");
//   };

//   const openDeleteModal = (sessionId) => {
//     setSessionToDelete(sessionId);
//     setShowDeleteModal(true);
//   };

//   return (
//     <>
//       {/* Hamburger Button for Mobile */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/90 transition-all duration-300 cursor-pointer ${
//           isOpen ? "hidden" : "block"
//         }`}
//       >
//         <Menu size={24} className="text-slate-600" />
//       </button>

//       {/* Sidebar */}
//       <div
//         ref={sidebarRef}
//         className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } md:static md:w-72 md:translate-x-0`}
//       >
//         {/* Header */}
//         <div className="sticky top-0 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-lg z-10 border-b border-white/30 p-4">
//           <div className="flex items-center justify-between">
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
//             <button
//               onClick={() => setIsOpen(false)}
//               className="md:hidden p-2 rounded-xl hover:bg-white/50 transition-all duration-300 hover:scale-110 backdrop-blur-sm cursor-pointer"
//               disabled={loading}
//             >
//               <X size={20} className="text-slate-600" />
//             </button>
//           </div>
//         </div>

//         {/* Content area */}
//         <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
//           <button
//             onClick={handleNewChat}
//             className="group relative flex items-center justify-center md:justify-start gap-3 w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:hover:translate-y-0 disabled:cursor-not-allowed overflow-hidden cursor-pointer"
//             disabled={loading}
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             {loading ? (
//               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//             ) : (
//               <Plus
//                 size={20}
//                 className="transition-transform duration-300 group-hover:rotate-90"
//               />
//             )}
//             <span className="text-sm font-medium relative z-10">
//               {loading ? "Creating..." : "New Chat"}
//             </span>
//           </button>

//           {loading ? (
//             <div className="flex justify-center p-6">
//               <div className="relative">
//                 <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//                 <div
//                   className="w-8 h-8 border-3 border-transparent border-t-indigo-400 rounded-full animate-spin absolute top-0 left-0"
//                   style={{ animationDirection: "reverse" }}
//                 ></div>
//               </div>
//             </div>
//           ) : sessions.length > 0 ? (
//             <div className="space-y-2">
//               {sessions.map((session, index) => (
//                 <div
//                   key={session._id}
//                   className={`group relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/60 hover:shadow-md transform hover:-translate-y-0.5 ${
//                     session._id === currentSessionId
//                       ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md"
//                       : "hover:bg-white/40"
//                   }`}
//                   onClick={() => handleSelectSession(session._id)}
//                   style={{ animationDelay: `${index * 50}ms` }}
//                 >
//                   {session._id === currentSessionId && (
//                     <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full"></div>
//                   )}
//                   {editingSessionId === session._id ? (
//                     <input
//                       type="text"
//                       value={newTitle}
//                       onChange={(e) => setNewTitle(e.target.value)}
//                       onBlur={() => handleSaveTitle(session._id)}
//                       onKeyPress={(e) =>
//                         e.key === "Enter" && handleSaveTitle(session._id)
//                       }
//                       className="flex-1 bg-white/80 text-slate-800 rounded-lg px-3 py-2 text-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
//                       autoFocus
//                     />
//                   ) : (
//                     <>
//                       <div className="flex-1 min-w-0">
//                         <span
//                           className="block truncate text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors duration-200"
//                           title={session.title}
//                         >
//                           {session.title}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 md:transition-all md:duration-300 md:transform md:translate-x-2 md:group-hover:translate-x-0">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleEditTitle(session._id, session.title);
//                           }}
//                           className="p-1.5 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-110 cursor-pointer"
//                         >
//                           <Edit2
//                             size={14}
//                             className="text-slate-500 hover:text-blue-600"
//                           />
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openDeleteModal(session._id);
//                           }}
//                           className="p-1.5 rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-110 cursor-pointer"
//                         >
//                           <Trash2
//                             size={14}
//                             className="text-slate-500 hover:text-red-600"
//                           />
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center p-8 space-y-4">
//               <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
//                 <span className="text-2xl">💬</span>
//               </div>
//               <p className="text-slate-500 text-sm">
//                 No chat history yet.
//                 <br />
//                 Start your first conversation!
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-gradient-to-t from-white/95 to-white/80 backdrop-blur-lg border-t border-white/30 p-4">
//           <div className="space-y-3">
//             <button className="group relative w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 rounded-2xl hover:from-amber-500 hover:to-orange-600 text-sm font-medium transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:cursor-not-allowed overflow-hidden cursor-pointer">
//               <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative z-10 flex items-center justify-center gap-2">
//                 <Sparkles size={16} className="animate-pulse" />
//                 Upgrade Account
//               </div>
//             </button>
//             {isAuthenticated && (
//               <button
//                 onClick={handleLogout}
//                 className="group relative w-full bg-black text-white py-3 rounded-2xl hover:from-red-600 hover:to-pink-600 text-sm font-medium transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:cursor-not-allowed overflow-hidden cursor-pointer"
//                 disabled={loading}
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <div className="relative z-10 flex items-center justify-center gap-2">
//                   <LogOut size={16} />
//                   Logout
//                 </div>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <DeleteChatModal
//           onConfirm={() => handleDeleteSession(sessionToDelete)}
//           onCancel={() => {
//             setShowDeleteModal(false);
//             setSessionToDelete(null);
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default History;

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Menu, Edit2, Sparkles, LogOut, X } from "lucide-react";
import api from "../../utils/api";
import {
  setSessions,
  setCurrentSession,
  clearMessages,
} from "../../redux/slices/chatSlice";
import { logout } from "../../redux/slices/authSlice";
import DeleteChatModal from "../modal/DeleteChatModal";

const LOGO_URL =
  "https://i.postimg.cc/RhqzpXz5/Gemini-Generated-Image-kyplvxkyplvxkypl-1.png";

const History = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessions = useSelector((state) => state.chat.sessions);
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleNewChat = async () => {
    setLoading(true);
    try {
      console.log("Creating new chat session");
      const response = await api.post("/chat/new");
      const newSession = {
        _id: response.data.sessionId,
        title: response.data.title,
        messages: [],
      };
      console.log("New session:", newSession);
      dispatch(setSessions([newSession, ...sessions]));
      dispatch(setCurrentSession({ sessionId: newSession._id, messages: [] }));
      setIsOpen(false);
    } catch (error) {
      console.error("New Chat Error:", error);
      alert(
        "Failed to create new chat: " +
          (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = (sessionId) => {
    const session = sessions.find((s) => s._id === sessionId);
    if (session) {
      dispatch(setCurrentSession({ sessionId, messages: session.messages }));
      setIsOpen(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    setLoading(true);
    try {
      console.log(`Deleting session: ${sessionId}`);
      await api.delete(`/chat/session/${sessionId}`);
      const updatedSessions = sessions.filter((s) => s._id !== sessionId);
      dispatch(setSessions(updatedSessions));
      if (currentSessionId === sessionId) {
        if (updatedSessions.length > 0) {
          dispatch(
            setCurrentSession({
              sessionId: updatedSessions[0]._id,
              messages: updatedSessions[0].messages,
            })
          );
        } else {
          await handleNewChat();
        }
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Delete Session Error:", error);
      if (error.response?.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        alert(
          "Failed to delete session: " +
            (error.response?.data?.message || "Unknown error")
        );
      }
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSessionToDelete(null);
    }
  };

  const handleEditTitle = (sessionId, currentTitle) => {
    setEditingSessionId(sessionId);
    setNewTitle(currentTitle);
  };

  const handleSaveTitle = async (sessionId) => {
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      await api.put(`/chat/session/${sessionId}`, { title: newTitle.trim() });
      const updatedSessions = sessions.map((s) =>
        s._id === sessionId ? { ...s, title: newTitle.trim() } : s
      );
      dispatch(setSessions(updatedSessions));
      setEditingSessionId(null);
      setNewTitle("");
      setIsOpen(false);
    } catch (error) {
      console.error("Edit Title Error:", error);
      if (error.response?.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        alert(
          "Failed to update title: " +
            (error.response?.data?.message || "Unknown error")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearMessages());
    navigate("/login");
  };

  const openDeleteModal = (sessionId) => {
    setSessionToDelete(sessionId);
    setShowDeleteModal(true);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-lg text-slate-200 hover:bg-slate-800 transition-all duration-300 ${
          isOpen ? "hidden" : "block"
        }`}
        aria-label="Open chat history"
      >
        <Menu size={20} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:w-80 md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles size={16} className="text-indigo-400" />
              </div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Lumo Chat
              </h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              aria-label="Close chat history"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 pb-2">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-300 group ring-1 ring-white/20"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform"
              />
            )}
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent">
          {loading ? (
            <div className="flex justify-center p-6">
              <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Recent Activity
              </div>
              {sessions.map((session, index) => (
                <div
                  key={session._id}
                  className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent ${
                    session._id === currentSessionId
                      ? "bg-white/10 border-white/5 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                  onClick={() => handleSelectSession(session._id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1 min-w-0">
                    {editingSessionId === session._id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onBlur={() => handleSaveTitle(session._id)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSaveTitle(session._id)
                        }
                        className="w-full bg-slate-900 text-white rounded px-2 py-1 text-sm border border-indigo-500/50 focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <p className="truncate text-sm font-medium">
                        {session.title}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {session._id === currentSessionId && (
                    <div className="flex items-center gap-1 opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTitle(session._id, session.title);
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-indigo-400 transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(session._id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center mb-3">
                <Sparkles size={20} className="text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">
                No history yet. Start a new conversation to see it here.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-950/50 backdrop-blur-md space-y-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Sparkles size={14} />
              </div>
              <span className="text-xs font-semibold text-indigo-300">
                Pro Plan
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Upgrade for advanced models and unlimited history.
            </p>
            <button className="w-full py-2 text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg transition-colors">
              Upgrade Now
            </button>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteChatModal
          onConfirm={() => handleDeleteSession(sessionToDelete)}
          onCancel={() => {
            setShowDeleteModal(false);
            setSessionToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default History;
