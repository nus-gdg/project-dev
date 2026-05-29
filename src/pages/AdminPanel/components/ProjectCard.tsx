import "../AdminPanel.css";
import {type Project} from "../../../firebase/projects";
import { useNavigate } from "react-router-dom";
import console from "../../../assets/console.svg"
import alien from "../../../assets/alien.svg"
import {
    Button,
    Typography
} from "@mui/material";

export default function ProjectCard({ project, onEdit }: { project: Project; onEdit: (project: Project) => void }) {
    const coverImageUrl = project.coverImage?.url;
    const navigate = useNavigate();

    return <div className="admin-project-card"> 
        <div className="thumbnail-container">
            {coverImageUrl ? (
                <img src={coverImageUrl} alt={`${project.title} thumbnail`} />
            ) : (
                <div className="thumbnail-placeholder">No project image</div>
            )}
            <Typography className="project-title">
                {project.title}
            </Typography>
        </div>
        <div className="project-description-box">
            {project.description}
        </div>
        <div className="background-image-top-right">
            <img src={console} alt="Console" />
        </div>
        <div className="background-image-bottom-left">
            <img src={alien} alt="Alien" />
        </div>
        <div className="admin-card-actions">
            <Button variant="outlined" onClick={() => navigate(`/project/${project.id}`)}>
                Preview
            </Button>
            <Button variant="contained" onClick={() => onEdit(project)}>
                Edit
            </Button>
        </div>
    </div>
}
