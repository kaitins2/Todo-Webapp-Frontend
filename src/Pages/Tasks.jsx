// Tasks.jsx
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
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import EventIcon from "@mui/icons-material/Event";
import "./Tasks.css";
import axios from "axios";
import Sidebar from "../assets/Components/Sidebar";

const Tasks = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editValues, setEditValues] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Show snackbar notification
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
        showSnackbar("Failed to fetch tasks", "error");
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
      priority: task.priority || "medium",
      dueDate: task.dueDate || "",
    });
  };

  const saveEdit = async (id) => {
    if (!editValues.title.trim()) {
      showSnackbar("Task title cannot be empty", "error");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/todo/${id}`,
        {
          title: editValues.title.trim(),
          description: editValues.description.trim(),
          priority: editValues.priority,
          dueDate: editValues.dueDate,
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
      showSnackbar("Task updated successfully");
    } catch (err) {
      setError("Failed to update task");
      showSnackbar("Failed to update task", "error");
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  const addTask = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      showSnackbar("Please enter a task title", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/todo`,
        {
          title: trimmedTitle,
          description: description.trim(),
          priority: priority,
          dueDate: dueDate,
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
      setPriority("medium");
      setDueDate("");
      showSnackbar("Task added successfully");
    } catch (err) {
      setError("Failed to add task");
      showSnackbar("Failed to add task", "error");
      console.error(err);
    }
  };

  const toggleDone = async (id) => {
    const task = tasks.find((t) => t.id === id);
    const newIsCompleted = !task.isCompleted;
    try {
      await axios.put(
        `${API_URL}/api/todo/${id}`,
        {
          isCompleted: newIsCompleted,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, isCompleted: newIsCompleted } : t
        )
      );
      showSnackbar(
        `Task marked as ${newIsCompleted ? "completed" : "incomplete"}`
      );
    } catch (err) {
      setError("Failed to update task status");
      showSnackbar("Failed to update task status", "error");
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
      showSnackbar("Task deleted successfully");
    } catch (err) {
      setError("Failed to delete task");
      showSnackbar("Failed to delete task", "error");
      console.error(err);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <PriorityHighIcon color="error" />;
      case "low":
        return <LowPriorityIcon color="action" />;
      default:
        return <PriorityHighIcon color="warning" />;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return "High Priority";
      case "low":
        return "Low Priority";
      default:
        return "Medium Priority";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading)
    return (
      <Box className="tasks-container">
        <Sidebar />
        <Box className="main-content center-content">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your tasks...
          </Typography>
        </Box>
      </Box>
    );

  return (
    <Box className="tasks-container">
      <Sidebar />
      <main className="main-content">
        <Box className="content-header">
          <h1 className="title">My Tasks</h1>
          <Chip
            label={`${
              tasks.filter((t) => !t.isCompleted).length
            } tasks remaining`}
            variant="outlined"
            color="primary"
            className="task-counter"
          />
        </Box>

        <Paper elevation={2} className="add-task-form">
          <Box className="form-row">
            <TextField
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              className="task-title-input"
              placeholder="What needs to be done?"
            />
            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              className="date-input"
            />
            <TextField
              select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
              SelectProps={{ native: true }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </TextField>
            <IconButton
              color="primary"
              onClick={addTask}
              className="add-button"
              size="large"
            >
              <AddIcon />
            </IconButton>
          </Box>
          <TextField
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            className="task-description-input"
          />
        </Paper>

        {tasks.length === 0 ? (
          <Paper elevation={2} className="empty-state">
            <Typography variant="h6" color="textSecondary" align="center">
              You don't have any tasks yet
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mt: 1 }}
            >
              Add a task above to get started
            </Typography>
          </Paper>
        ) : (
          <List className="tasks-list">
            {tasks.map((task) => (
              <ListItem
                key={task.id}
                alignItems="flex-start"
                className={`task-item ${task.isCompleted ? "completed" : ""}`}
              >
                <Checkbox
                  checked={task.isCompleted}
                  onChange={() => toggleDone(task.id)}
                  className="task-checkbox"
                />

                {isEditing === task.id ? (
                  <Box className="edit-form">
                    <Box className="form-row">
                      <TextField
                        value={editValues.title}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        size="small"
                        className="edit-title-input"
                        required
                      />
                      <TextField
                        label="Due Date"
                        type="date"
                        value={editValues.dueDate}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            dueDate: e.target.value,
                          }))
                        }
                        InputLabelProps={{ shrink: true }}
                        className="date-input"
                      />
                      <TextField
                        select
                        label="Priority"
                        value={editValues.priority}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            priority: e.target.value,
                          }))
                        }
                        className="priority-select"
                        SelectProps={{ native: true }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </TextField>
                    </Box>
                    <TextField
                      value={editValues.description}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      className="edit-description-input"
                    />
                    <Box className="task-actions">
                      <IconButton
                        onClick={() => saveEdit(task.id)}
                        color="primary"
                        className="save-button"
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        onClick={cancelEdit}
                        color="secondary"
                        className="cancel-button"
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box className="task-content">
                      <ListItemText
                        primary={
                          <Typography
                            className={`task-title ${
                              task.isCompleted ? "completed" : ""
                            }`}
                          >
                            {task.title}
                            {task.priority && task.priority !== "medium" && (
                              <span className="priority-indicator">
                                {getPriorityIcon(task.priority)}
                              </span>
                            )}
                          </Typography>
                        }
                        secondary={
                          <Box className="task-details">
                            {task.description && (
                              <Typography className="task-description">
                                {task.description}
                              </Typography>
                            )}
                            <Box className="task-meta">
                              {task.dueDate && (
                                <Chip
                                  icon={<EventIcon />}
                                  label={formatDate(task.dueDate)}
                                  size="small"
                                  variant="outlined"
                                  className="due-date-chip"
                                />
                              )}
                              {task.priority && task.priority !== "medium" && (
                                <Chip
                                  label={getPriorityLabel(task.priority)}
                                  size="small"
                                  variant="outlined"
                                  className={`priority-chip ${task.priority}`}
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      <Box className="task-actions">
                        <IconButton
                          edge="end"
                          onClick={() => startEdit(task)}
                          className="edit-button"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => deleteTask(task.id)}
                          className="delete-button"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </main>
    </Box>
  );
};

export default Tasks;
