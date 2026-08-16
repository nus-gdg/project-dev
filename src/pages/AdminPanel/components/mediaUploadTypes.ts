import type { Media } from "../../../firebase/projects";

export interface MediaItem {
  id: string;
  url: string;
  file?: File;
  media?: Media;
}
