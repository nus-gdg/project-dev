import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import { deleteProject, type Project } from "../../../firebase/projects";

interface Props {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}

export default function DeleteConfirmDialog({ open, project, onClose }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete(): Promise<void> {
    if (!project?.id) return;

    try {
      setIsDeleting(true);
      await deleteProject(project);
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      slots={{ paper: Paper }}
      slotProps={{
        paper: {
          sx: {
            m: 2,
            width: "min(420px, calc(100vw - 32px))",
            maxWidth: "calc(100vw - 32px)",
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle>Delete Project</DialogTitle>

      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete <b>{project?.title}</b>? This cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          color="error"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
