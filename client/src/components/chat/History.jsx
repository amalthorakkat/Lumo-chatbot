import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, Menu, Edit2 } from "lucide-react";
import api from "../../utils/api";
import {
  setSessions,
  setCurrentSession,
  clearMessages,
} from "../../redux/slices/chatSlice";

const History = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.chat.sessions);
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);

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
    } catch (error) {
      console.error("Edit Title Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } flex-shrink-0 h-full bg-gray-900 text-white flex flex-col transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && <h1 className="text-lg font-bold">Chat History</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-gray-700 p-1 rounded"
          disabled={loading}
        >
          <Menu size={20} />
        </button>
      </div>
      <button
        onClick={handleNewChat}
        className="flex items-center justify-center sm:justify-start gap-2 m-2 p-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition duration-150 disabled:bg-gray-600"
        disabled={loading}
      >
        <Plus size={18} />
        {isOpen && <span>New Chat</span>}
      </button>
      <div className="flex-1 overflow-y-auto pt-2">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : sessions.length > 0 ? (
          <ul className="space-y-1 px-2">
            {sessions.map((session) => (
              <li
                key={session._id}
                className={`group flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer transition duration-150 ${
                  session._id === currentSessionId ? "bg-gray-800" : ""
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
                      className="flex-1 bg-gray-700 text-white rounded p-1 text-sm"
                      autoFocus
                    />
                  ) : (
                    <>
                      <span
                        className="flex-1 truncate text-sm"
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
                          className="text-gray-400 hover:text-blue-400"
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
                          className="text-gray-400 hover:text-red-400"
                        />
                      </button>
                    </>
                  )
                ) : (
                  <span className="mx-auto" title={session.title}>
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
      <div className="p-3 border-t border-gray-700">
        {isOpen ? (
          <button className="w-full bg-gray-800 py-2 rounded hover:bg-gray-700 text-sm">
            Upgrade Account
          </button>
        ) : (
          <span className="block text-center text-lg" title="Upgrade">
            ⚡
          </span>
        )}
      </div>
    </div>
  );
};

export default History;
