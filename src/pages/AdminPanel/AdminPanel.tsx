import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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

  const fetchProjects = async () => {
    const projs = await getProjects();
    setProjects(projs);
  };

  // Fetch projects
  useEffect(() => {
    let isActive = true;

    getProjects().then((projs) => {
      if (isActive) {
        setProjects(projs);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

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
          {projects.map((proj) => {
            const projectPath = proj.id ? `/project/${proj.id}` : undefined;

            return (
              <Box
                key={proj.id ?? proj.title}
                sx={{ mb: 1, borderRadius: 1, backgroundColor: "rgba(166, 225, 255, 0.5)", textAlign: "left", p: 2 }}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                  <Box
                    component={projectPath ? RouterLink : "div"}
                    to={projectPath}
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      color: "inherit",
                      textDecoration: "none",
                      borderRadius: 1,
                      p: 1,
                      mx: -1,
                      my: -1,
                      transition: "background-color 0.2s ease, transform 0.2s ease",
                      "&:hover": projectPath ? {
                        backgroundColor: "rgba(255, 255, 255, 0.14)",
                        transform: "translateY(-1px)",
                      } : undefined,
                      "&:focus-visible": {
                        outline: "3px solid #67F5D8",
                        outlineOffset: 2,
                      },
                    }}
                  >
                    <Typography variant="h3">{proj.title}</Typography>

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

                  <IconButton onClick={() => handleOpenEdit(proj)} aria-label={`Edit ${proj.title}`}>
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
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

