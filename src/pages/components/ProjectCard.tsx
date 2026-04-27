// Project card component to display title, description and button to view project page
import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, description }) => {
  const navigate = useNavigate();

  const handleViewProject = () => {
    navigate(`/projects/${id}`);
  };
  
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
          {description}
        </Typography>
        <Button variant="contained" onClick={handleViewProject}>
          View Project
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;