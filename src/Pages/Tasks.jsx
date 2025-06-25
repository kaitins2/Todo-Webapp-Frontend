import React, { useState } from "react";
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

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(null); // task.id or null
  const [editValues, setEditValues] = useState({ title: "", description: "" });

  const startEdit = (task) => {
    setIsEditing(task.id);
    setEditValues({ title: task.title, description: task.description });
  };

  const saveEdit = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...editValues } : t)));
    setIsEditing(null);
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  const addTask = () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    if (!trimmedTitle && !trimmedDesc) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: trimmedTitle,
        description: trimmedDesc,
        done: false,
      },
    ]);

    setTitle("");
    setDescription("");
  };

  const toggleDone = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
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
                checked={task.done}
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
                      <AddIcon /> {/* Consider replacing with SaveIcon */}
                    </IconButton>
                    <IconButton onClick={cancelEdit} color="secondary">
                      <DeleteIcon /> {/* Consider replacing with CancelIcon */}
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          color: task.done ? "gray" : "black",
                          textDecoration: task.done ? "line-through" : "none",
                          fontWeight: "bold",
                        }}
                      >
                        {task.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          color: task.done ? "gray" : "black",
                          textDecoration: task.done ? "line-through" : "none",
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
