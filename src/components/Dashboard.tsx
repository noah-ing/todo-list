import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  category: string;
  completed: boolean;
}

interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  upcomingWeek: number;
  byCategoryAndPriority: {
    [category: string]: {
      low: number;
      medium: number;
      high: number;
    };
  };
}

const Dashboard: React.FC = () => {
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaskStats = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const tasksQuery = query(
          collection(db, "tasks"),
          where("userId", "==", user.uid),
        );
        const querySnapshot = await getDocs(tasksQuery);

        const tasks: Task[] = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Task,
        );
        const now = new Date();
        const oneWeekFromNow = new Date(
          now.getTime() + 7 * 24 * 60 * 60 * 1000,
        );

        const stats: TaskStats = {
          total: tasks.length,
          completed: tasks.filter((task) => task.completed).length,
          overdue: tasks.filter(
            (task) => !task.completed && new Date(task.dueDate) < now,
          ).length,
          upcomingWeek: tasks.filter(
            (task) =>
              !task.completed && new Date(task.dueDate) <= oneWeekFromNow,
          ).length,
          byCategoryAndPriority: {},
        };

        tasks.forEach((task) => {
          if (!stats.byCategoryAndPriority[task.category]) {
            stats.byCategoryAndPriority[task.category] = {
              low: 0,
              medium: 0,
              high: 0,
            };
          }
          stats.byCategoryAndPriority[task.category][task.priority]++;
        });

        setTaskStats(stats);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching task stats:", err);
        setError("Failed to fetch task statistics");
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!taskStats) {
    return <div>No task data available.</div>;
  }

  const chartData = Object.entries(taskStats.byCategoryAndPriority).map(
    ([category, priorities]) => ({
      category,
      Low: priorities.low,
      Medium: priorities.medium,
      High: priorities.high,
    }),
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Task Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Total Tasks</h2>
          <p className="text-3xl font-bold">{taskStats.total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Completed</h2>
          <p className="text-3xl font-bold">{taskStats.completed}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Overdue</h2>
          <p className="text-3xl font-bold">{taskStats.overdue}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Due This Week</h2>
          <p className="text-3xl font-bold">{taskStats.upcomingWeek}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Tasks by Category and Priority
      </h2>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Low" stackId="a" fill="#10B981" />
            <Bar dataKey="Medium" stackId="a" fill="#F59E0B" />
            <Bar dataKey="High" stackId="a" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;git checkout gh-pages
mv build/* .git commit -m "Update Dashboard component"
