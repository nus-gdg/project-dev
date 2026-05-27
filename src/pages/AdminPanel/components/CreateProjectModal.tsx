import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { storage } from "../../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import RecruitingInput from "./RecruitingInput";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, TextField, Paper, Box, CircularProgress,
  IconButton, Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { type Project, createProject, updateProject } from "../../../firebase/projects";

interface Props {
  open: boolean;
  onClose: () => void;
  project: Project | null; // null = create mode, Project = edit mode
}

export default function CreateProjectModal({ open, onClose, project }: Props) {
  const isEditing = project !== null;

  // Initialise from the existing project when editing, otherwise start empty
  const [title, setTitle] = useState<string>(project?.title ?? "");
  const [description, setDescription] = useState<string>(project?.description ?? "");
  const [roles, setRoles] = useState<string[]>(project?.roles ?? []);

  // imageFile = a newly picked File (not yet uploaded)
  // imagePreview = local blob URL for the new file, or the existing remote URL
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.imageUrl ?? null,
  );
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress + upload image to Firebase Storage, returns the download URL
  async function uploadProjectImage(file: File, projectId?: string): Promise<string> {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: "image/webp",
    });

    const path = `projects/${projectId ?? Date.now()}/cover.webp`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, compressed, {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000",
    });

    return getDownloadURL(storageRef);
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke the previous blob URL if it was locally generated (not a remote URL)
    if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview);

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage(): void {
    // Only revoke blob URLs, not remote Firebase URLs
    if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview);

    setImageFile(null);
    setImagePreview(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave(): Promise<void> {
    try {
      setImageUploading(true);

      // Start with the existing remote URL (may be null for new projects)
      let imageUrl: string | null = project?.imageUrl ?? null;

      // Only upload if the user picked a new local file
      if (imageFile) {
        imageUrl = await uploadProjectImage(imageFile, project?.id);
      }

      if (isEditing) {
        await updateProject(project?.id ?? "", { ...project, title, description, roles, imageUrl });
      } else {
        await createProject({ title, description, roles, imageUrl });
      }

      handleClose();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setImageUploading(false);
    }
  }

  function handleClose(): void {
    // Revoke any dangling blob URL before closing
    if (imageFile && imagePreview) URL.revokeObjectURL(imagePreview);
    onClose();
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slots={{ paper: Paper }}
      slotProps={{
        paper: {
          sx: { minWidth: 600, maxWidth: "90%", borderRadius: 3 },
        },
      }}
    >
      <DialogTitle>{isEditing ? "Edit Project" : "Create Project"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            maxRows={15}
            fullWidth
          />

          <RecruitingInput roles={roles} setRoles={setRoles} />

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImagePick}
          />
          <Typography variant="body1"><b>Cover Image</b></Typography>
          {imagePreview ? (
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <Box
                component="img"
                src={imagePreview}
                alt="Cover preview"
                sx={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
              <IconButton
                size="small"
                onClick={handleRemoveImage}
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  bgcolor: "rgba(0,0,0,0.55)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: "1.5px dashed",
                borderColor: "divider",
                borderRadius: 2,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <CloudUploadIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                Click to upload a cover image
              </Typography>
              <Typography variant="caption" color="text.disabled">
                PNG, JPG, WEBP — compressed automatically
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={imageUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={imageUploading}
          startIcon={imageUploading ? <CircularProgress size={16} /> : null}
        >
          {imageUploading ? "Saving…" : isEditing ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}