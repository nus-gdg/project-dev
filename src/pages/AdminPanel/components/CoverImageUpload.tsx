import { useRef, type ChangeEvent } from "react";
import {
  ACCEPTED_IMAGE_TYPES,
  MediaPreviewCard,
  SectionHeader,
  UploadDropzone,
} from "./MediaUploadPreview";
import type { MediaItem } from "./mediaUploadTypes";

interface CoverImageUploadProps {
  coverImage: MediaItem | null;
  onPick: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export default function CoverImageUpload({
  coverImage,
  onPick,
  onRemove,
}: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        style={{ display: "none" }}
        onChange={onPick}
      />

      <SectionHeader
        title="Cover Image"
        actionLabel="Replace cover"
        showAction={Boolean(coverImage)}
        onAction={() => inputRef.current?.click()}
      />

      {coverImage ? (
        <MediaPreviewCard
          item={coverImage}
          alt="Cover preview"
          aspectRatio="16 / 9"
          maxHeight={220}
          onRemove={onRemove}
        />
      ) : (
        <UploadDropzone
          primaryText="Click to upload a cover image"
          hintText="PNG, JPG, WEBP"
          onClick={() => inputRef.current?.click()}
        />
      )}
    </>
  );
}
