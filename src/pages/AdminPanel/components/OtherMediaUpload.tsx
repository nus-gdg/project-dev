import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Box } from "@mui/material";
import {
  ACCEPTED_MEDIA_TYPES,
  MediaListItem,
  SectionHeader,
  UploadDropzone,
} from "./MediaUploadPreview";
import type { MediaItem } from "./mediaUploadTypes";

interface OtherMediaUploadProps {
  otherMedia: MediaItem[];
  onPick: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
}

export default function OtherMediaUpload({
  otherMedia,
  onPick,
  onRemove,
  onReorder,
}: OtherMediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draggableId, setDraggableId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function handleDrop(event: DragEvent<HTMLDivElement>, targetId: string): void {
    event.preventDefault();

    if (draggedId && draggedId !== targetId) {
      onReorder(draggedId, targetId);
    }
  }

  function handleDragEnd(): void {
    setDraggableId(null);
    setDraggedId(null);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MEDIA_TYPES}
        multiple
        style={{ display: "none" }}
        onChange={onPick}
      />

      <SectionHeader
        title="Other Media"
        actionLabel="Add media"
        showAction={otherMedia.length > 0}
        onAction={() => inputRef.current?.click()}
      />

      {otherMedia.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%", maxWidth: 520 }}>
          {otherMedia.map((item, index) => (
            <MediaListItem
              key={item.id}
              item={item}
              alt={`Project media preview ${index + 1}`}
              onRemove={() => onRemove(item.id)}
              draggable={draggableId === item.id}
              isDragging={draggedId === item.id}
              onHandlePointerDown={() => setDraggableId(item.id)}
              onHandlePointerUp={() => setDraggableId(null)}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                setDraggedId(item.id);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, item.id)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Box>
      ) : (
        <UploadDropzone
          primaryText="Click to upload additional images or videos"
          onClick={() => inputRef.current?.click()}
        />
      )}
    </>
  );
}
