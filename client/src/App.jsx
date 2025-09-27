import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ChatPage from "./components/chat/ChatPage";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <Login />
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/chat" replace /> : <Signup />
            }
          />
          <Route
            path="/chat"
            element={
              isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/chat" : "/login"} replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
