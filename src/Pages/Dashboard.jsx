// Dashboard.jsx
import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>MyApp</h2>
        <nav>
          <ul>
            <li>Home</li>
            <li>Profile</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <h1 className='title'>Welcome to the Dashboard</h1>
        <p className='title'>This is your main area. You can put charts, tables, or anything else here.</p>
      </main>
    </div>
  );
};

export default Dashboard;