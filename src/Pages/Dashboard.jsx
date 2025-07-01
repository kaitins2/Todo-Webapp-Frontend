// Dashboard.jsx
import React from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import Sidebar from "../assets/Components/Sidebar";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h1 className="title">Welcome to the Dashboard</h1>
        <p className="title">
          This is your main area. You can put charts, tables, or anything else
          here.
        </p>
      </main>
    </div>
  );
};

export default Dashboard;
