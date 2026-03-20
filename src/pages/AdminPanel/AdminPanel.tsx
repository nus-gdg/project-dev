import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecruitingInput from "./components/RecruitingInput";
import {
  Box,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { type Project, getProjects, createProject, updateProject } from "../../firebase/projects"
import { logout } from "../../firebase/auth";

export default function AdminPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState<string[]>([])

  const navigate = useNavigate()

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const projs = await getProjects();
    setProjects(projs);
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setRoles([])
    setOpenDialog(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setRoles(project.roles);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    const projData: Project = {
      title,
      description,
      roles,
    };

    if (editingProject?.id) {
      await updateProject(editingProject.id, projData);
    } else {
      await createProject(projData);
    }

    setOpenDialog(false);
    fetchProjects();
  };

  const handleLogout = async() => {
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
      <Box sx={{display: "flex", justifyContent: "space-between", alignItems:"center"}}>
        <Typography variant="h2">Admin Panel</Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      
      <Divider sx={{ mb: 4, mt: 1 }}></Divider>
      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 2 }}>
        Create Project
      </Button>

      <Paper elevation={2} sx={{ background: "linear-gradient(135deg, #283C77 27%, #20053D 100%)", p: 4 }}>
        <Stack>
          {projects.map((proj) => (
            <Box
              key={proj.id}
              sx={{ mb: 1, borderRadius: 1, backgroundColor: "rgba(166, 225, 255, 0.5)", textAlign: "left", p: 2 }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography variant="h3">{proj.title}</Typography>
                <IconButton onClick={() => handleOpenEdit(proj)}>
                  <EditIcon />
                </IconButton>
              </Box>

              <Typography variant="body2">{proj.description.length > 50
                ? proj.description.slice(0, 1000) + "..."
                : proj.description}</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", rowGap: 1, mt: 2 }}>
                <Typography variant="body1">Recruiting: </Typography>
                {proj.roles.map((role, index) => {
                  return <Chip key={`${proj.title}-${index}`} label={role} />
                })}
              </Box>

            </Box>
          ))}
        </Stack>
      </Paper>


      {/* Dialog for create/edit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} slots={{
        paper: Paper, 
      }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 600,      
              maxWidth: "90%",  
              borderRadius: 3, 
            },
          },
        }}>
        <DialogTitle>{editingProject ? "Edit Project" : "Create Project"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={3}
              maxRows={15}
              fullWidth
            />
            <RecruitingInput roles={roles} setRoles={setRoles}/>
          </Stack>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

