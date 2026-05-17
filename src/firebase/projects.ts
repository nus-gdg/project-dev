import { collection, addDoc, getDocs, getDoc, updateDoc, doc, Timestamp, onSnapshot } from "firebase/firestore";
import { db } from "./config";

export interface Project {
  id?: string;
  title: string;
  description: string;
  roles: string[];
  imageUrl: string | null;
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
  };
  await updateDoc(docRef, updateData);
}
