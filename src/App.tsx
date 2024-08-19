import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import EditTask from "./components/EditTask";
import Profile from "./components/Profile";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import { User as FirebaseUser } from "firebase/auth";
import WelcomeScreen from "./components/WelcomeScreen";
import TopNavBar from "./components/TopNavBar";
import "./App.css";

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app flex flex-col min-h-screen bg-gray-100">
        {user && <TopNavBar />}
        <main className="flex-grow pt-16 px-4">
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <WelcomeScreen />}
            />
            <Route
              path="/signin"
              element={user ? <Navigate to="/dashboard" /> : <SignIn />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/tasks"
              element={user ? <TaskList /> : <Navigate to="/" />}
            />
            <Route
              path="/add-task"
              element={user ? <AddTask /> : <Navigate to="/" />}
            />
            <Route
              path="/edit-task/:id"
              element={user ? <EditTask /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
