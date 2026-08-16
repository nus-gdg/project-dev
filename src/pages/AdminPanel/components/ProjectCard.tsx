import { type Project, isVideoMedia } from "../../../firebase/projects";
import { useNavigate } from "react-router-dom";
import console1 from "/console1.svg";
import console2 from "/console2.svg";
import sprite1 from "/sprite1.svg";
import sprite2 from "/sprite2.svg";
import {
  Box,
  Button,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const cardPalettes = {
  even: {
    background: "linear-gradient(to bottom left, #283C77 0%, #5B84FC 78%)",
    thumbnailBackground: "#20053D",
    titleColor: "#8EBEFA",
    descriptionColor: "rgba(220, 230, 255, 0.92)",
    descriptionBorder: "#283C77",
  },
  odd: {
    background: "linear-gradient(to bottom left, #A6E1FF 0%, #7BA1F5 78%)",
    thumbnailBackground: "#283C77",
    titleColor: "white",
    descriptionColor: "#0c1e3a",
    descriptionBorder: "#142a4d",
  },
};

export default function ProjectCard({
  project,
  index,
  onEdit,
  onDelete,
}: {
  project: Project;
  index: number;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  const coverMedia = project.coverImage;
  const navigate = useNavigate();

  const isEven = (index + 1) % 2 === 0;
  const palette = isEven ? cardPalettes.even : cardPalettes.odd;

  return <Box
    sx={{
      minHeight: 500,
      background: palette.background,
      borderRadius: 2,
      mb: 2,
      p: 2,
      boxShadow: "0 4px 8px 4px #283c7772",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        p: 2,
        pb: 1,
        bgcolor: palette.thumbnailBackground,
        borderRadius: 3,
        mb: 1.5,
      }}
    >
      {coverMedia ? (
        isVideoMedia(coverMedia) ? (
          <Box
            component="video"
            src={coverMedia.url}
            muted
            playsInline
            preload="metadata"
            aria-label={`${project.title} thumbnail`}
            sx={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              border: "1px solid #ffffff",
              borderRadius: 2,
              display: "block",
              mb: 1,
            }}
          />
        ) : (
          <Box
            component="img"
            src={coverMedia.url}
            alt={`${project.title} thumbnail`}
            sx={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              border: "1px solid #ffffff",
              borderRadius: 2,
              display: "block",
              mb: 1,
            }}
          />
        )
      ) : (
        <Box
          sx={{
            width: "100%",
            height: 180,
            border: "1px solid #ffffff",
            borderRadius: 2,
            color: "#dce6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          No project image
        </Box>
      )}
      <Typography sx={{ fontWeight: 900, color: palette.titleColor }}>
        {project.title}
      </Typography>
    </Box>
    <Box
      sx={{
        border: `2px solid ${palette.descriptionBorder}`,
        borderRadius: 3,
        px: 1.75,
        py: 1.5,
        color: palette.descriptionColor,
        position: "relative",
        zIndex: 1,
        mb: 2,
        flex: 1,
        whiteSpace: "pre-wrap",
      }}
    >
      {project.description}
    </Box>
    <Box
      sx={{
        position: "absolute",
        top: -64,
        right: -48,
        overflow: "hidden",
        width: 200,
        height: 200,
      }}
    >
      <Box component="img" src={isEven ? console2 : console1} alt="Console" sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
    </Box>
    <Box
      sx={{
        position: "absolute",
        bottom: -48,
        left: -64,
        overflow: "hidden",
        width: 180,
        height: 180,
      }}
    >
      <Box component="img" src={isEven ? sprite2 : sprite1} alt="Sprite" sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
    </Box>
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        justifyContent: "flex-end",
        position: "relative",
        zIndex: 1,
        mt: "auto",
      }}
    >
      <Button variant="contained" onClick={() => navigate(`/project/${project.id}`)}>
        Preview
      </Button>
      <Button variant="contained" onClick={() => onEdit(project)}>
        Edit
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={() => onDelete(project)}
      >
        Delete
      </Button>
    </Box>
  </Box>
}
