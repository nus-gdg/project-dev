import { useState, type ChangeEvent } from "react";
import imageCompression from "browser-image-compression";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { storage } from "../../../firebase/config";
import {
  createProject,
  type Media,
  type Project,
  updateProject,
} from "../../../firebase/projects";
import CoverImageUpload from "./CoverImageUpload";
import OtherMediaUpload from "./OtherMediaUpload";
import RecruitingInput from "./RecruitingInput";
import type { MediaItem } from "./mediaUploadTypes";

const MAX_IMAGE_SIZE_MB = 0.5;
const MAX_IMAGE_DIMENSION = 1200;

interface Props {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

function makeMediaItemId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createLocalMediaItem(file: File): MediaItem {
  return {
    id: makeMediaItemId(),
    url: URL.createObjectURL(file),
    file,
  };
}

function revokeLocalMediaUrl(item: MediaItem | null): void {
  if (item?.file) {
    URL.revokeObjectURL(item.url);
  }
}

function getInitialCoverImage(project: Project | null): MediaItem | null {
  const coverImage = project?.coverImage;
  if (!coverImage) return null;

  return {
    id: makeMediaItemId(),
    url: coverImage.url,
    media: coverImage,
  };
}

function getInitialOtherMedia(project: Project | null): MediaItem[] {
  return (project?.otherMedia ?? []).map((item) => ({
    id: makeMediaItemId(),
    url: item.url,
    media: item,
  }));
}

function getExistingMedia(item: MediaItem): Media {
  if (!item.media) {
    throw new Error("Existing project media is missing its saved media fields.");
  }

  return item.media;
}

async function uploadProjectMedia(file: File, folderId: string, index: number): Promise<Media> {
  const baseName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9-_]+/gi, "-")
    .toLowerCase();
  const isVideo = file.type === "video/mp4" || file.type === "video/webm";
  const filename = isVideo
    ? `${baseName || "project-video"}-${Date.now()}-${index}.${file.type === "video/webm" ? "webm" : "mp4"}`
    : `${baseName || "project-image"}-${Date.now()}-${index}.webp`;
  const path = `projects/${folderId}/${index === 0 ? "cover" : "media"}/${filename}`;
  const storageRef = ref(storage, path);
  const uploadedFile = isVideo
    ? file
    : await imageCompression(file, {
        maxSizeMB: MAX_IMAGE_SIZE_MB,
        maxWidthOrHeight: MAX_IMAGE_DIMENSION,
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

async function saveMediaItem(item: MediaItem, folderId: string, index: number): Promise<Media> {
  return item.file ? uploadProjectMedia(item.file, folderId, index) : getExistingMedia(item);
}

export default function CreateProjectModal({ open, onClose, project }: Props) {
  const isEditing = project !== null;

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [roles, setRoles] = useState<string[]>(project?.roles ?? []);
  const [coverImage, setCoverImage] = useState<MediaItem | null>(() => getInitialCoverImage(project));
  const [otherMedia, setOtherMedia] = useState<MediaItem[]>(() => getInitialOtherMedia(project));
  const [isSaving, setIsSaving] = useState(false);

  function handleCoverPick(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("The cover must be an image. Videos can be added under Other Media.");
      event.target.value = "";
      return;
    }

    setCoverImage((currentCover) => {
      revokeLocalMediaUrl(currentCover);
      return createLocalMediaItem(file);
    });

    event.target.value = "";
  }

  function handleMediaPick(event: ChangeEvent<HTMLInputElement>): void {
    const pickedFiles = Array.from(event.target.files ?? []);
    if (pickedFiles.length === 0) return;

    setOtherMedia((currentMedia) => [
      ...currentMedia,
      ...pickedFiles.map(createLocalMediaItem),
    ]);

    event.target.value = "";
  }

  function handleRemoveCover(): void {
    setCoverImage((currentCover) => {
      revokeLocalMediaUrl(currentCover);
      return null;
    });
  }

  function handleRemoveMedia(id: string): void {
    setOtherMedia((currentMedia) => {
      const mediaToRemove = currentMedia.find((item) => item.id === id);
      revokeLocalMediaUrl(mediaToRemove ?? null);

      return currentMedia.filter((item) => item.id !== id);
    });
  }

  function handleReorderMedia(draggedId: string, targetId: string): void {
    setOtherMedia((currentMedia) => {
      const fromIndex = currentMedia.findIndex((item) => item.id === draggedId);
      const toIndex = currentMedia.findIndex((item) => item.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return currentMedia;

      const reordered = [...currentMedia];
      const [movedItem] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, movedItem);

      return reordered;
    });
  }

  function releaseLocalObjectUrls(): void {
    revokeLocalMediaUrl(coverImage);
    otherMedia.forEach(revokeLocalMediaUrl);
  }

  function handleClose(): void {
    releaseLocalObjectUrls();
    onClose();
  }

  async function handleSave(): Promise<void> {
    try {
      setIsSaving(true);

      const folderId = project?.id ?? `draft-${Date.now()}`;
      const savedCoverImage = coverImage ? await saveMediaItem(coverImage, folderId, 0) : null;
      const savedOtherMedia = await Promise.all(
        otherMedia.map((item, index) => saveMediaItem(item, folderId, index + 1)),
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
      setIsSaving(false);
    }
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
      <DialogTitle sx={{ flexShrink: 0 }}>
        {isEditing ? "Edit Project" : "Create Project"}
      </DialogTitle>

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
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            multiline
            minRows={3}
            maxRows={15}
            fullWidth
          />

          <RecruitingInput roles={roles} setRoles={setRoles} />

          <CoverImageUpload
            coverImage={coverImage}
            onPick={handleCoverPick}
            onRemove={handleRemoveCover}
          />

          <OtherMediaUpload
            otherMedia={otherMedia}
            onPick={handleMediaPick}
            onRemove={handleRemoveMedia}
            onReorder={handleReorderMedia}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ flexShrink: 0 }}>
        <Button onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={16} /> : null}
        >
          {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
