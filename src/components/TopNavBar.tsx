import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ListTodo, PlusSquare, User, LogOut, BarChart2 } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const TopNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1a202c",
        color: "white",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <Link
        to="/dashboard"
        style={{
          color: location.pathname === "/dashboard" ? "#63b3ed" : "white",
        }}
      >
        <BarChart2 size={24} />
      </Link>
      <Link
        to="/tasks"
        style={{ color: location.pathname === "/tasks" ? "#63b3ed" : "white" }}
      >
        <ListTodo size={24} />
      </Link>
      <Link
        to="/add-task"
        style={{
          color: location.pathname === "/add-task" ? "#63b3ed" : "white",
        }}
      >
        <PlusSquare size={24} />
      </Link>
      <Link
        to="/profile"
        style={{
          color: location.pathname === "/profile" ? "#63b3ed" : "white",
        }}
      >
        <User size={24} />
      </Link>
      <button
        onClick={handleLogout}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
        }}
      >
        <LogOut size={24} />
      </button>
    </nav>
  );
};

export default TopNavBar;
