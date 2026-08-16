// Project card component for odd indexed project
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayCircle";
import { isVideoMedia, type Media } from "../../firebase/projects";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  coverImage: Media | null;
}

const ProjectCardOdd: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  coverImage,
}) => {
  const navigate = useNavigate();

  const handleViewProject = () => {
    navigate(`../project/${id}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "500px",
        minHeight: "500px",
        borderRadius: {
          xs: "18px",
          sm: "20px",
          md: "24px",
        },
        background: "linear-gradient(45deg, #7BA1F5 30%, #A6E1FF 100%)",
        boxShadow:
          "0 8px 32px rgba(10, 20, 80, 0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
        border: "2px solid rgba(100, 140, 255, 0.35)",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          flex: 1,
          borderRadius: {
            xs: "18px",
            sm: "20px",
            md: "24px",
          },
          backgroundImage: `url('sprite1.svg'), url('console1.svg')`,
          backgroundPosition: "-30% 100%, 115% -20%",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: {
            xs: "130px, 180px",
            sm: "160px, 190px",
            md: "220px, 200px",
          },
          p: {
            xs: "14px",
            sm: "18px",
            md: "20px",
          },
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            borderRadius: {
              xs: "10px",
              sm: "12px",
              md: "14px",
            },
            overflow: "hidden",
            border: "2px solid rgba(80, 110, 210, 0.5)",
            boxShadow:
              "inset 0 0 18px rgba(10, 20, 80, 0.6), 0 2px 12px rgba(10,20,80,0.4)",
            background: "#283C77",
            aspectRatio: "4 / 3",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            p: {
              xs: 1,
              sm: 1.5,
            },
          }}
        >
          {coverImage && isVideoMedia(coverImage) ? (
            <video
              src={coverImage.url}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={title}
              style={{
                borderRadius: "14px",
                width: "80%",
                height: "80%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <img
              src={coverImage?.url || "placeholder.png"}
              alt={title}
              style={{
                borderRadius: "14px",
                width: "80%",
                height: "80%",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}
          <Typography
            variant="h3"
            sx={{
              color: "#DBEDFF",
              fontSize: {
                xs: "1.15rem",
                sm: "1.5rem",
                md: "1.95rem",
              },
              fontWeight: 900,
              textAlign: "center",
              textTransform: "uppercase",
              lineHeight: 1.2,
              mt: 0.5,
              px: 1,
              wordBreak: "break-word",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            borderRadius: "12px",
            border: "2px solid #283C77",
            px: {
              xs: 1.25,
              sm: 1.5,
            },
            py: {
              xs: 1,
              sm: 1.25,
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#20053D",
              lineHeight: 1.55,
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
              fontWeight: 700,
              whiteSpace: "pre-wrap",
            }}
          >
            {description}
          </Typography>
        </Box>
        <Button
          onClick={handleViewProject}
          startIcon={
            <PlayArrowIcon
              sx={{
                fontSize: {
                  xs: "1.5rem !important",
                  sm: "1.8rem !important",
                  md: "2rem !important",
                },
              }}
            />
          }
          sx={{
            mt: "auto",
            borderRadius: "999px",
            background:
              "linear-gradient(180deg, #B478FD 0%,rgb(163, 91, 230) 60%,rgb(152, 97, 184) 100%)",
            color: "#20053D",
            fontWeight: 900,
            fontSize: {
              xs: "0.9rem",
              sm: "1.1rem",
              md: "1.45rem",
            },
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            px: {
              xs: 2,
              sm: 3,
            },
            py: {
              xs: 0.9,
              sm: 1,
            },
            boxShadow:
              "0 4px 16px rgba(120, 80, 220, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
            border: "1px solid rgba(160,130,255,0.4)",
            alignSelf: "stretch",
            minHeight: {
              xs: "48px",
              sm: "56px",
            },
            "&:hover": {
              background:
                "linear-gradient(180deg, #c4a8ff 0%,rgb(193, 123, 240) 60%,rgb(176, 111, 219) 100%)",
              boxShadow:
                "0 6px 22px rgba(185, 141, 211, 0.65), inset 0 1px 0 rgba(255,255,255,0.25)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0px)",
              boxShadow: "0 2px 8px rgba(120, 80, 220, 0.4)",
            },
            transition: "all 0.18s ease",
          }}
        >
          View Project Page
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectCardOdd;
