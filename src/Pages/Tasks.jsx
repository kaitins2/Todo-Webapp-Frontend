import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import "./Tasks.css";

// Set your backend URL here
const API_URL = "https://localhost:7240/api/todo";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", description: "" });

  const token = localStorage.getItem("token");

  // Create an axios instance with auth header
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/");
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const addTask = async () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    if (!trimmedTitle && !trimmedDesc) return;

    try {
      const response = await axiosInstance.post("/", {
        title: trimmedTitle,
        description: trimmedDesc,
      });
      setTasks((prev) => [...prev, response.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const saveEdit = async (id) => {
    try {
      const taskToUpdate = tasks.find((t) => t.id === id);
      const updatedTask = {
        ...taskToUpdate,
        title: editValues.title,
        description: editValues.description,
        isCompleted: taskToUpdate.isCompleted ?? false,
      };

      await axiosInstance.put(`/${id}`, updatedTask);

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...editValues } : t))
      );
      setIsEditing(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const toggleDone = async (id) => {
    try {
      const taskToUpdate = tasks.find((t) => t.id === id);
      const updatedTask = {
        ...taskToUpdate,
        isCompleted: !taskToUpdate.isCompleted,
      };

      await axiosInstance.put(`/${id}`, updatedTask);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        )
      );
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const startEdit = (task) => {
    setIsEditing(task.id);
    setEditValues({ title: task.title, description: task.description });
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  return (
    <Box className="tasks-container">
      <aside className="sidebar">
        <h2>MyApp</h2>
        <nav>
          <ul>
            <li>Home</li>
            <li>
              <Link to="/tasks">Tasks</Link>
            </li>
            <li>Habits</li>
            <li>Profile</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <h1 className="title">My Tasks</h1>

        <Box className="add-task-form">
          <TextField
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
          <IconButton color="primary" onClick={addTask}>
            <AddIcon />
          </IconButton>
        </Box>

        <List>
          {tasks.map((task) => (
            <ListItem key={task.id} alignItems="flex-start" sx={{ gap: 1 }}>
              <Checkbox
                checked={!!task.isCompleted}
                onChange={() => toggleDone(task.id)}
              />

              {isEditing === task.id ? (
                <>
                  <TextField
                    value={editValues.title}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    size="small"
                    sx={{ mr: 1, width: "30%" }}
                  />
                  <TextField
                    value={editValues.description}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    size="small"
                    sx={{ mr: 1, width: "50%" }}
                  />
                  <Box className="task-actions">
                    <IconButton
                      onClick={() => saveEdit(task.id)}
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={cancelEdit} color="secondary">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          color: task.isCompleted ? "gray" : "black",
                          textDecoration: task.isCompleted
                            ? "line-through"
                            : "none",
                          fontWeight: "bold",
                        }}
                      >
                        {task.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          color: task.isCompleted ? "gray" : "black",
                          textDecoration: task.isCompleted
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {task.description}
                      </Typography>
                    }
                  />
                  <Box className="task-actions">
                    <IconButton edge="end" onClick={() => startEdit(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => deleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </main>
    </Box>
  );
};

export default Tasks;
