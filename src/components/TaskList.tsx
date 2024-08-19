import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link } from "react-router-dom";
import { Edit, Trash2, CheckCircle, Search, Filter, X } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  category: string;
  completed: boolean;
}

type SortOption = "dueDate" | "priority" | "category" | "title";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<
    "low" | "medium" | "high" | ""
  >("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy(sortBy, sortOrder),
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const newTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(newTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sortBy, sortOrder]);

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    await updateDoc(doc(db, "tasks", taskId), { completed: !completed });
  };

  const deleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteDoc(doc(db, "tasks", taskId));
    }
  };

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((task) =>
      categoryFilter ? task.category === categoryFilter : true,
    )
    .filter((task) =>
      priorityFilter ? task.priority === priorityFilter : true,
    );

  const uniqueCategories = Array.from(
    new Set(tasks.map((task) => task.category)),
  );

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 flex-grow"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "active" | "completed")
            }
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value as "low" | "medium" | "high" | "",
              )
            }
            className="border rounded px-2 py-1"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleSort("dueDate")}
            className="border rounded px-2 py-1"
          >
            Sort by Due Date{" "}
            {sortBy === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("priority")}
            className="border rounded px-2 py-1"
          >
            Sort by Priority{" "}
            {sortBy === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("category")}
            className="border rounded px-2 py-1"
          >
            Sort by Category{" "}
            {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("title")}
            className="border rounded px-2 py-1"
          >
            Sort by Title{" "}
            {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>
      <Link
        to="/add-task"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
      >
        Add New Task
      </Link>
      {filteredAndSortedTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredAndSortedTasks.map((task) => (
            <li
              key={task.id}
              className={`bg-white shadow rounded-lg p-4 ${task.completed ? "opacity-50" : ""}`}
            >
              <div className="flex justify-between items-center">
                <h2
                  className={`text-xl font-semibold ${task.completed ? "line-through" : ""}`}
                >
                  {task.title}
                </h2>
                <div className="space-x-2">
                  <button
                    onClick={() =>
                      toggleTaskCompletion(task.id, task.completed)
                    }
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${task.completed ? "bg-gray-400 hover:bg-gray-500" : "bg-green-600 hover:bg-green-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    {task.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <Link
                    to={`/edit-task/${task.id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{task.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Due: {task.dueDate}
                </span>
                <span className="text-sm text-gray-500">
                  Category: {task.category}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
