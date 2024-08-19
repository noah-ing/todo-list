import React from "react";
import SignIn from "./SignIn";

const WelcomeScreen: React.FC = () => (
  <div className="welcome-screen p-8 max-w-2xl mx-auto">
    <h1 className="text-4xl font-bold mb-4">
      Welcome to Your To-Do List & Organizer
    </h1>
    <p className="mb-4">
      This app helps you organize your tasks, set priorities, and stay on top of
      your deadlines.
    </p>
    <h2 className="text-2xl font-semibold mb-2">Features:</h2>
    <ul className="list-disc list-inside mb-4">
      <li>Create and manage tasks</li>
      <li>Categorize tasks and set priorities</li>
      <li>Set deadlines for your tasks</li>
      <li>Mark tasks as complete</li>
      <li>View task statistics in your profile</li>
      <li>Sync your tasks across devices</li>
    </ul>
    <p className="mb-4">Sign in to start organizing your life!</p>
    <SignIn />
  </div>
);

export default WelcomeScreen;
