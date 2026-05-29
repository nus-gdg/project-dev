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
import { type Media, type Project, createProject, updateProject } from "../../../firebase/projects";

interface Props {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  media?: Media;
}

function makeImageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function mediaFromUrl(url: string): Media {
  return {
    url,
    path: "",
    filename: "legacy-project-image",
  };
}

function getInitialCoverImage(project: Project | null): ImageItem | null {
  if (!project) return null;

  const coverImage = project.coverImage;
  if (!coverImage) return null;

  return {
    id: makeImageId(),
    url: coverImage.url,
    media: coverImage,
  };
}

function getInitialOtherMedia(project: Project | null): ImageItem[] {
  if (!project) return [];

  return (project.otherMedia ?? []).map((item) => ({
    id: makeImageId(),
    url: item.url,
    media: item,
  }));
}

export default function CreateProjectModal({ open, onClose, project }: Props) {
  const isEditing = project !== null;

  const [title, setTitle] = useState<string>(project?.title ?? "");
  const [description, setDescription] = useState<string>(project?.description ?? "");
  const [roles, setRoles] = useState<string[]>(project?.roles ?? []);
  const [coverImage, setCoverImage] = useState<ImageItem | null>(() => getInitialCoverImage(project));
  const [otherMedia, setOtherMedia] = useState<ImageItem[]>(() => getInitialOtherMedia(project));
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  async function uploadProjectImage(file: File, folderId: string, index: number): Promise<Media> {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: "image/webp",
    });

    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
    const filename = `${baseName || "project-image"}-${Date.now()}-${index}.webp`;
    const path = `projects/${folderId}/${index === 0 ? "cover" : "media"}/${filename}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, compressed, {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000",
    });

    return {
      url: await getDownloadURL(storageRef),
      path,
      filename,
    };
  }

  function handleCoverPick(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverImage((currentCover) => {
      if (currentCover?.file) URL.revokeObjectURL(currentCover.url);

      return {
        id: makeImageId(),
        url: URL.createObjectURL(file),
        file,
      };
    });

    if (coverInputRef.current) coverInputRef.current.value = "";
  }

  function handleMediaPick(e: React.ChangeEvent<HTMLInputElement>): void {
    const pickedFiles = Array.from(e.target.files ?? []);
    if (pickedFiles.length === 0) return;

    setOtherMedia((currentMedia) => [
      ...currentMedia,
      ...pickedFiles.map((file) => ({
        id: makeImageId(),
        url: URL.createObjectURL(file),
        file,
      })),
    ]);

    if (mediaInputRef.current) mediaInputRef.current.value = "";
  }

  function handleRemoveCover(): void {
    setCoverImage((currentCover) => {
      if (currentCover?.file) URL.revokeObjectURL(currentCover.url);
      return null;
    });
  }

  function handleRemoveMedia(id: string): void {
    setOtherMedia((currentMedia) => {
      const mediaToRemove = currentMedia.find((image) => image.id === id);
      if (mediaToRemove?.file) URL.revokeObjectURL(mediaToRemove.url);

      return currentMedia.filter((image) => image.id !== id);
    });
  }

  async function handleSave(): Promise<void> {
    try {
      setImageUploading(true);

      const folderId = project?.id ?? `draft-${Date.now()}`;
      const savedCoverImage = coverImage
        ? coverImage.file
          ? await uploadProjectImage(coverImage.file, folderId, 0)
          : coverImage.media ?? mediaFromUrl(coverImage.url)
        : null;
      const savedOtherMedia = await Promise.all(
        otherMedia.map((image, index) => {
          if (image.file) return uploadProjectImage(image.file, folderId, index + 1);
          return Promise.resolve(image.media ?? mediaFromUrl(image.url));
        }),
      );

      const projectPayload: Project = {
        title,
        description,
        roles,
        coverImage: savedCoverImage,
        otherMedia: savedOtherMedia,
      };

      if (isEditing) {
        await updateProject(project.id ?? "", projectPayload);
      } else {
        await createProject(projectPayload);
      }

      handleClose();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setImageUploading(false);
    }
  }

  function handleClose(): void {
    if (coverImage?.file) URL.revokeObjectURL(coverImage.url);
    otherMedia.forEach((image) => {
      if (image.file) URL.revokeObjectURL(image.url);
    });
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      maxWidth={false}
      slots={{ paper: Paper }}
      slotProps={{
        paper: {
          sx: {
            m: 2,
            width: "min(600px, calc(100vw - 32px))",
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "calc(100vh - 32px)",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle sx={{ flexShrink: 0 }}>{isEditing ? "Edit Project" : "Create Project"}</DialogTitle>

      <DialogContent
        dividers
        sx={{
          flex: "1 1 auto",
          minHeight: 0,
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
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

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleCoverPick}
          />

          <input
            ref={mediaInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleMediaPick}
          />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Typography variant="body1">
              <b>Cover Image</b>
            </Typography>
            {coverImage ? (
              <Button
                size="small"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => coverInputRef.current?.click()}
              >
                Replace cover
              </Button>
            ) : null}
          </Box>

          {coverImage ? (
            <Box sx={{ position: "relative", width: "100%", maxWidth: 520 }}>
              <Box
                component="img"
                src={coverImage.url}
                alt="Cover preview"
                sx={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "block",
                }}
              />
              <IconButton
                size="small"
                onClick={handleRemoveCover}
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
              onClick={() => coverInputRef.current?.click()}
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
                PNG, JPG, WEBP - compressed automatically
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Typography variant="body1">
              <b>Other Media</b>
            </Typography>
            {otherMedia.length > 0 ? (
              <Button
                size="small"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => mediaInputRef.current?.click()}
              >
                Add media
              </Button>
            ) : null}
          </Box>

          {otherMedia.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 1.5,
                width: "100%",
                maxWidth: 520,
              }}
            >
              {otherMedia.map((image, index) => (
                <Box key={image.id} sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={image.url}
                    alt={`Project media preview ${index + 1}`}
                    sx={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      display: "block",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveMedia(image.id)}
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
              ))}
            </Box>
          ) : (
            <Box
              onClick={() => mediaInputRef.current?.click()}
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
                Click to upload additional images
              </Typography>
              <Typography variant="caption" color="text.disabled">
                PNG, JPG, WEBP - compressed automatically
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ flexShrink: 0 }}>
        <Button onClick={handleClose} disabled={imageUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={imageUploading}
          startIcon={imageUploading ? <CircularProgress size={16} /> : null}
        >
          {imageUploading ? "Saving..." : isEditing ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
