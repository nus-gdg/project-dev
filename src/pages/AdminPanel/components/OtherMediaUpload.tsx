import { useRef, type ChangeEvent } from "react";
import { Box } from "@mui/material";
import {
  ACCEPTED_MEDIA_TYPES,
  MediaPreviewCard,
  SectionHeader,
  UploadDropzone,
} from "./MediaUploadPreview";
import type { MediaItem } from "./mediaUploadTypes";

interface OtherMediaUploadProps {
  otherMedia: MediaItem[];
  onPick: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
}

export default function OtherMediaUpload({
  otherMedia,
  onPick,
  onRemove,
}: OtherMediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 1.5,
            width: "100%",
            maxWidth: 520,
          }}
        >
          {otherMedia.map((item, index) => (
            <MediaPreviewCard
              key={item.id}
              item={item}
              alt={`Project media preview ${index + 1}`}
              aspectRatio="4 / 3"
              onRemove={() => onRemove(item.id)}
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
