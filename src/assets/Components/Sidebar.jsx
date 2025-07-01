import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-container">
      <Box className="tasks-container" sx={{ backgroundColor: "transparent" }}>
        <aside className="sidebar">
          <h2>MyApp</h2>
          <nav>
            <ul className="sidebar-menu">
              <li>
                <Button onClick={() => navigate("/dashboard")} fullWidth>
                  Home
                </Button>
              </li>
              <li>
                <Button onClick={() => navigate("/tasks")} fullWidth>
                  Tasks
                </Button>
              </li>
              <li>
                <Button fullWidth>Habits</Button>
              </li>
              <li>
                <Button fullWidth>Profile</Button>
              </li>
              <li>
                <Button fullWidth>Settings</Button>
              </li>
              <li>
                <Button fullWidth color="error">
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </aside>
      </Box>
    </div>
  );
};

export default Sidebar;
