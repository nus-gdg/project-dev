import { useRef, type ChangeEvent } from "react";
import { Box } from "@mui/material";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={otherMedia.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%", maxWidth: 520 }}
            >
              {otherMedia.map((item, index) => (
                <MediaListItem
                  key={item.id}
                  item={item}
                  alt={`Project media preview ${index + 1}`}
                  onRemove={() => onRemove(item.id)}
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      ) : (
        <UploadDropzone
          primaryText="Click to upload additional images or videos"
          onClick={() => inputRef.current?.click()}
        />
      )}
    </>
  );
}
