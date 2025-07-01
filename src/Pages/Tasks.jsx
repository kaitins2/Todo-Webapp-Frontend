import React, { useState, useEffect } from "react";
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
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import "./Tasks.css";
import axios from "axios";
import Sidebar from "../assets/Components/Sidebar";

const Tasks = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/todo`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(response.data);
      } catch (err) {
        setError("Failed to fetch tasks");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [API_URL]);

  const startEdit = (task) => {
    setIsEditing(task.id);
    setEditValues({
      title: task.title,
      description: task.description || "",
    });
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/todo/${id}`,
        {
          title: editValues.title,
          description: editValues.description,
          isCompleted: tasks.find((t) => t.id === id).isCompleted,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
      setIsEditing(null);
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  const addTask = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/todo`,
        {
          title: trimmedTitle,
          description: description.trim(),
          isCompleted: false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Failed to add task");
      console.error(err);
    }
  };

  const toggleDone = async (id) => {
    const task = tasks.find((t) => t.id === id);
    try {
      const response = await axios.put(
        `${API_URL}/api/todo/${id}`,
        {
          ...task,
          isCompleted: !task.isCompleted,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
    } catch (err) {
      setError("Failed to update task status");
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todo/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <Box className="tasks-container">
      <Sidebar />
      <main className="main-content">
        <h1 className="title">My Tasks</h1>
        <Box className="add-task-form">
          <TextField
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
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
                checked={task.isCompleted}
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
                    required
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
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={cancelEdit} color="secondary">
                      <CancelIcon />
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
