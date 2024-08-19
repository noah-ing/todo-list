import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    overdue: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTaskStats(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTaskStats = async (userId: string) => {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
    );

    const querySnapshot = await getDocs(tasksQuery);
    const now = new Date();
    let total = 0;
    let completed = 0;
    let overdue = 0;

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      total++;
      if (task.completed) completed++;
      if (!task.completed && new Date(task.deadline) < now) overdue++;
    });

    setTaskStats({ total, completed, overdue });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return (
      <div className="profile p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
        <p>Please sign in to view your profile.</p>
        <Link
          to="/signin"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="profile p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Profile</h2>
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <img
            src={user.photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-2"
          />
          <h3 className="text-xl font-semibold text-center">
            {user.displayName}
          </h3>
          <p className="text-gray-600 text-center">{user.email}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">Task Statistics</h3>
          <p>Total Tasks: {taskStats.total}</p>
          <p>Completed Tasks: {taskStats.completed}</p>
          <p>Overdue Tasks: {taskStats.overdue}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded w-full"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;