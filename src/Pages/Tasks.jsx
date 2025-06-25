import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const addTask = () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    if (!trimmedTitle && !trimmedDesc) return;

    setTasks([...tasks, {
      id: Date.now(),
      title: trimmedTitle,
      description: trimmedDesc,
      done: false
    }]);

    setTitle('');
    setDescription('');
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <Box className="tasks-container">
      <aside className="sidebar">
        <h2>MyApp</h2>
        <nav>
          <ul>
            <li>Home</li>
            <li><Link to="/tasks">Tasks</Link></li>
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
          {tasks.map(task => (
            <ListItem key={task.id} alignItems="flex-start">
              <Checkbox
                checked={task.done}
                onChange={() => toggleDone(task.id)}
              />
              <ListItemText
                primary={task.title}
                secondary={task.description}
                primaryTypographyProps={{
                  sx: {
                    color: task.done ? 'gray' : 'black',
                    textDecoration: task.done ? 'line-through' : 'none',
                    fontWeight: 'bold'
                  }
                }}
                secondaryTypographyProps={{
                  sx: {
                    color: task.done ? 'gray' : 'black',
                    textDecoration: task.done ? 'line-through' : 'none'
                  }
                }}
              />
              <IconButton edge="end" onClick={() => deleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </main>
    </Box>
  );
};

export default Tasks;
