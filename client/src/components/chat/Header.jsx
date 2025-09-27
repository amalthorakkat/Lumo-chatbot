import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearMessages } from "../../redux/slices/chatSlice";

const Header = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearMessages());
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <h2 className="text-xl font-bold">Chatbot</h2>
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
