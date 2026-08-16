import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "./components/ProjectCard";
import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { type Project, subscribeProjects } from "../../firebase/projects"
import { logout } from "../../firebase/auth";
import CreateProjectModal from "./components/CreateProjectModal";

export default function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const navigate = useNavigate()

  // Fetch projects
  useEffect(() => {
    const unsubscribe = subscribeProjects(setProjects);
    return () => unsubscribe();
  }, []);

  const handleOpenCreate = () => {
    setOpenDialog(true);
    setEditingProject(null);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setOpenDialog(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login")
  }
  
return (
  <Box sx={{
    width: {
      sm: "100%",
      md: "70%",
    },
    mx: "auto", my: 5, textAlign: "left"
  }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography variant="h2">Admin Panel</Typography>
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </Box>

    <Divider sx={{ mb: 4, mt: 1 }}></Divider>
    <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 2 }}>
      Create Project
    </Button>

    <Grid container spacing={3} mt={1}>
      {projects.map((proj, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={proj.id}>
          <ProjectCard project={proj} index={index} onEdit={handleOpenEdit} />
        </Grid>
      ))}
    </Grid>


    {/* Dialog for create/edit */}
    {
      openDialog && <CreateProjectModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        project={editingProject}
      />
    }
  </Box>
)
}
