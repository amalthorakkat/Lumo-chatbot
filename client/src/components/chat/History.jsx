import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Menu, Edit2 } from "lucide-react";
import api from "../../utils/api";
import {
  setSessions,
  setCurrentSession,
  clearMessages,
} from "../../redux/slices/chatSlice";
import { logout } from "../../redux/slices/authSlice";

const History = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768); // Open by default on desktop, closed on mobile
  const [loading, setLoading] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessions = useSelector((state) => state.chat.sessions);
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleNewChat = async () => {
    setLoading(true);
    try {
      dispatch(clearMessages());
      const response = await api.post("/chat/new");
      const newSession = {
        _id: response.data.sessionId,
        title: response.data.title,
        messages: [],
      };
      dispatch(setSessions([newSession, ...sessions]));
      dispatch(setCurrentSession({ sessionId: newSession._id, messages: [] }));
      if (window.innerWidth < 768) setIsOpen(false); // Close sidebar on mobile after action
    } catch (error) {
      console.error("New Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = (sessionId) => {
    const session = sessions.find((s) => s._id === sessionId);
    if (session) {
      dispatch(setCurrentSession({ sessionId, messages: session.messages }));
      if (window.innerWidth < 768) setIsOpen(false); // Close sidebar on mobile
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this chat session?"))
      return;
    setLoading(true);
    try {
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
          dispatch(setCurrentSession({ sessionId: null, messages: [] }));
        }
      }
      if (window.innerWidth < 768) setIsOpen(false); // Close sidebar on mobile
    } catch (error) {
      console.error("Delete Session Error:", error);
    } finally {
      setLoading(false);
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
      if (window.innerWidth < 768) setIsOpen(false); // Close sidebar on mobile
    } catch (error) {
      console.error("Edit Title Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearMessages());
    navigate("/login");
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } md:w-64 fixed md:static inset-y-0 left-0 z-30 bg-white text-gray-800 shadow-lg flex flex-col transition-all duration-300 md:transition-none`}
    >
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {isOpen ? (
            <h1 className="text-xl font-semibold text-gray-800">Lumo</h1>
          ) : (
            <span
              className="mx-auto text-lg font-semibold text-gray-800"
              title="Chatbot"
            >
              💬
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-full hover:bg-gray-100 md:hidden"
            disabled={loading}
          >
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center md:justify-start gap-2 w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-400"
          disabled={loading}
        >
          <Plus size={18} />
          {isOpen && <span className="text-sm">New Chat</span>}
        </button>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : sessions.length > 0 ? (
          <ul className="space-y-1 mt-2">
            {sessions.map((session) => (
              <li
                key={session._id}
                className={`group flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-200 ${
                  session._id === currentSessionId ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelectSession(session._id)}
              >
                {isOpen ? (
                  editingSessionId === session._id ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => handleSaveTitle(session._id)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSaveTitle(session._id)
                      }
                      className="flex-1 bg-gray-100 text-gray-800 rounded p-1 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <>
                      <span
                        className="flex-1 truncate text-sm text-gray-700"
                        title={session.title}
                      >
                        {session.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTitle(session._id, session.title);
                        }}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2
                          size={16}
                          className="text-gray-500 hover:text-blue-500"
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session._id);
                        }}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2
                          size={16}
                          className="text-gray-500 hover:text-red-500"
                        />
                      </button>
                    </>
                  )
                ) : (
                  <span className="mx-auto text-gray-700" title={session.title}>
                    💬
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          isOpen && (
            <p className="text-gray-500 text-sm p-4 text-center">
              No chat history yet. Start a new chat!
            </p>
          )
        )}
      </div>
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3">
        {isOpen ? (
          <div className="space-y-2">
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 text-sm transition duration-200 disabled:bg-gray-400">
              Upgrade Account
            </button>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm transition duration-200 disabled:bg-gray-400"
                disabled={loading}
              >
                Logout
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <button
              className="block mx-auto text-center text-lg text-gray-700 hover:text-blue-600"
              title="Upgrade"
            >
              ⚡
            </button>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="block mx-auto text-center text-lg text-red-500 hover:text-red-600"
                title="Logout"
                disabled={loading}
              >
                🚪
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
