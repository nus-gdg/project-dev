import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, Timestamp, onSnapshot } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "./config";

export type MediaKind = "image" | "video";

export interface Media {
  url: string;
  path: string;
  filename: string;
  kind: MediaKind;
}

export function isVideoMedia(media: Media | null | undefined): boolean {
  return media?.kind === "video";
}

export const DEFAULT_APPLY_INFO =
  "Tell the project team which role you are interested in, what you would like to contribute, and any portfolio or class project links that help show your work.";

export interface Project {
  id?: string;
  title: string;
  description: string;
  roles: string[];
  coverImage: Media | null;
  otherMedia: Media[];
  applyInfo: string;
}

const COLLECTION_NAME = "projects";

// CREATE
export async function createProject(project: Project) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...project,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// FETCH ALL
export async function getProjects(): Promise<Project[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project));
}

export function subscribeProjects(onChange: (projects: Project[]) => void) {
  return onSnapshot(collection(db, COLLECTION_NAME), (snapshot) => {
    const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project));
    onChange(projects);
  });
}

export async function getProject(id: string): Promise<Project | null> {
  const snapshot = await getDoc(doc(db, COLLECTION_NAME, id));

  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() } as Project;
}

export async function updateProject(id: string, project: Project) {
  const docRef = doc(db, COLLECTION_NAME, id);
  const updateData = {
    title: project.title,
    description: project.description,
    roles: project.roles,
    coverImage: project.coverImage,
    otherMedia: project.otherMedia,
    applyInfo: project.applyInfo,
  };
  await updateDoc(docRef, updateData);
}

async function deleteStorageFile(path: string): Promise<void> {
  try {
    await deleteObject(ref(storage, path));
  } catch (err) {
    console.error(`Failed to delete storage file at ${path}:`, err);
  }
}

export async function deleteStorageFiles(paths: string[]): Promise<void> {
  await Promise.all(paths.map(deleteStorageFile));
}

export async function deleteProject(project: Project) {
  if (!project.id) return;

  await deleteDoc(doc(db, COLLECTION_NAME, project.id));

  const mediaPaths = [project.coverImage, ...project.otherMedia]
    .filter((media): media is Media => media !== null)
    .map((media) => media.path);

  await deleteStorageFiles(mediaPaths);
}
