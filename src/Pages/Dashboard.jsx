// Dashboard.jsx
import React from "react";
import "./Dashboard.css";
import Sidebar from "../assets/Components/Sidebar";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h1 className="title">Welcome to the Dashboard</h1>
        <p className="subtitle">
          This is your main area. You can put charts, tables, or widgets here.
        </p>

        <div className="dashboard-cards">
          <div className="card">
            <h2>Analytics</h2>
            <p>Placeholder for chart or analytics widget.</p>
          </div>
          <div className="card">
            <h2>Recent Activity</h2>
            <p>Placeholder for activity feed.</p>
          </div>
          <div className="card">
            <h2>Tasks</h2>
            <p>Placeholder for tasks or reminders.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
