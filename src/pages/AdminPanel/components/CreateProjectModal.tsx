import { useRef, useState, type ReactElement } from "react";
import imageCompression from "browser-image-compression";
import { storage } from "../../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import RecruitingInput from "./RecruitingInput";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import {
  type Media,
  type Project,
  createProject,
  isVideoMedia,
  updateProject,
} from "../../../firebase/projects";

interface Props {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

interface MediaItem {
  id: string;
  url: string;
  file?: File;
  media?: Media;
}

function makeImageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getInitialCoverImage(project: Project | null): MediaItem | null {
  if (!project) return null;

  const coverImage = project.coverImage;
  if (!coverImage) return null;

  return {
    id: makeImageId(),
    url: coverImage.url,
    media: coverImage,
  };
}

function getInitialOtherMedia(project: Project | null): MediaItem[] {
  if (!project) return [];

  return (project.otherMedia ?? []).map((item) => ({
    id: makeImageId(),
    url: item.url,
    media: item,
  }));
}

function renderMediaPreview(item: MediaItem, alt: string): ReactElement {
  const isVideo = item.file ? item.file.type.startsWith("video/") : item.media ? isVideoMedia(item.media) : false;

  if (isVideo) {
    return <video src={item.url} controls playsInline preload="metadata" aria-label={alt} />;
  }

  return <img src={item.url} alt={alt} />;
}

function getExistingMedia(item: MediaItem): Media {
  if (!item.media) {
    throw new Error("Existing project media is missing its saved media fields.");
  }

  return item.media;
}

export default function CreateProjectModal({ open, onClose, project }: Props) {
  const isEditing = project !== null;

  const [title, setTitle] = useState<string>(project?.title ?? "");
  const [description, setDescription] = useState<string>(project?.description ?? "");
  const [roles, setRoles] = useState<string[]>(project?.roles ?? []);
  const [coverImage, setCoverImage] = useState<MediaItem | null>(() => getInitialCoverImage(project));
  const [otherMedia, setOtherMedia] = useState<MediaItem[]>(() => getInitialOtherMedia(project));
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  async function uploadProjectMedia(file: File, folderId: string, index: number): Promise<Media> {
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
    const isVideo = file.type === "video/mp4" || file.type === "video/webm";
    const filename = isVideo
      ? `${baseName || "project-video"}-${Date.now()}-${index}.${file.type === "video/webm" ? "webm" : "mp4"}`
      : `${baseName || "project-image"}-${Date.now()}-${index}.webp`;
    const path = `projects/${folderId}/${index === 0 ? "cover" : "media"}/${filename}`;
    const storageRef = ref(storage, path);
    const uploadedFile = isVideo
      ? file
      : await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: "image/webp",
        });

    await uploadBytes(storageRef, uploadedFile, {
      contentType: isVideo ? file.type : "image/webp",
      cacheControl: "public, max-age=31536000",
    });

    return {
      url: await getDownloadURL(storageRef),
      path,
      filename,
      kind: isVideo ? "video" : "image",
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
          ? await uploadProjectMedia(coverImage.file, folderId, 0)
          : getExistingMedia(coverImage)
        : null;
      const savedOtherMedia = await Promise.all(
        otherMedia.map((image, index) => {
          if (image.file) return uploadProjectMedia(image.file, folderId, index + 1);
          return Promise.resolve(getExistingMedia(image));
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
            accept="image/*,video/mp4,video/webm"
            style={{ display: "none" }}
            onChange={handleCoverPick}
          />

          <input
            ref={mediaInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm"
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
                sx={{
                  width: "100%",
                  maxHeight: 220,
                  aspectRatio: "16 / 9",
                  overflow: "hidden",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "block",
                  "& img, & video": {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  },
                }}
              >
                {renderMediaPreview(coverImage, "Cover preview")}
              </Box>
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
                Click to upload a cover image or video
              </Typography>
              <Typography variant="caption" color="text.disabled">
                PNG, JPG, WEBP, MP4, WEBM
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
                    sx={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      overflow: "hidden",
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      display: "block",
                      "& img, & video": {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      },
                    }}
                  >
                    {renderMediaPreview(image, `Project media preview ${index + 1}`)}
                  </Box>
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
                Click to upload additional images or videos
              </Typography>
              <Typography variant="caption" color="text.disabled">
                PNG, JPG, WEBP, MP4, WEBM
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
