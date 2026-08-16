import type { DragEvent, ReactElement } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { isVideoMedia } from "../../../firebase/projects";
import type { MediaItem } from "./mediaUploadTypes";

export const ACCEPTED_IMAGE_TYPES = "image/*";
export const ACCEPTED_MEDIA_TYPES = "image/*,video/mp4,video/webm";

function isVideoItem(item: MediaItem): boolean {
  if (item.file) return item.file.type.startsWith("video/");
  return isVideoMedia(item.media);
}

function getMediaItemName(item: MediaItem): string {
  return item.file?.name ?? item.media?.filename ?? "Untitled media";
}

function renderMediaPreview(item: MediaItem, alt: string): ReactElement {
  if (isVideoItem(item)) {
    return <video src={item.url} controls playsInline preload="metadata" aria-label={alt} />;
  }

  return <img src={item.url} alt={alt} />;
}

function renderThumbnail(item: MediaItem, alt: string): ReactElement {
  if (isVideoItem(item)) {
    return (
      <>
        <video src={item.url} muted playsInline preload="metadata" aria-label={alt} />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            bgcolor: "rgba(0,0,0,0.25)",
          }}
        >
          <PlayArrowIcon fontSize="small" />
        </Box>
      </>
    );
  }

  return <img src={item.url} alt={alt} />;
}

export function SectionHeader({
  title,
  actionLabel,
  showAction,
  onAction,
}: {
  title: string;
  actionLabel: string;
  showAction: boolean;
  onAction: () => void;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="body1">
        <b>{title}</b>
      </Typography>
      {showAction ? (
        <Button size="small" variant="outlined" startIcon={<CloudUploadIcon />} onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  );
}

export function UploadDropzone({
  primaryText,
  hintText = "PNG, JPG, WEBP, MP4, WEBM",
  onClick,
}: {
  primaryText: string;
  hintText?: string;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
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
        {primaryText}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {hintText}
      </Typography>
    </Box>
  );
}

export function MediaPreviewCard({
  item,
  alt,
  onRemove,
  aspectRatio,
  maxHeight,
}: {
  item: MediaItem;
  alt: string;
  onRemove: () => void;
  aspectRatio: string;
  maxHeight?: number;
}) {
  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 520 }}>
      <Box
        sx={{
          width: "100%",
          maxHeight,
          aspectRatio,
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
        {renderMediaPreview(item, alt)}
      </Box>
      <IconButton
        size="small"
        onClick={onRemove}
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
  );
}

export function MediaListItem({
  item,
  alt,
  onRemove,
  draggable,
  isDragging,
  onHandlePointerDown,
  onHandlePointerUp,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  item: MediaItem;
  alt: string;
  onRemove: () => void;
  draggable: boolean;
  isDragging: boolean;
  onHandlePointerDown: () => void;
  onHandlePointerUp: () => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}) {
  return (
    <Box
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Box
        onMouseDown={onHandlePointerDown}
        onMouseUp={onHandlePointerUp}
        sx={{
          display: "flex",
          alignItems: "center",
          color: "text.disabled",
          cursor: "grab",
          touchAction: "none",
          "&:active": { cursor: "grabbing" },
        }}
      >
        <DragIndicatorIcon />
      </Box>

      <Box
        sx={{
          position: "relative",
          width: 56,
          height: 56,
          flexShrink: 0,
          borderRadius: 1.5,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          "& img, & video": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          },
        }}
      >
        {renderThumbnail(item, alt)}
      </Box>

      <Typography
        variant="body2"
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {getMediaItemName(item)}
      </Typography>

      <IconButton size="small" onClick={onRemove} aria-label="Remove media">
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
