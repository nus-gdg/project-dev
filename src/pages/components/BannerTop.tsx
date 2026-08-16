import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface BannerTopProps {
  isProjectView?: boolean;
}


const BannerTop: React.FC<BannerTopProps> = ({ isProjectView = false }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isProjectView) {
      navigate(-1);
    } else {
    window.open("https://nusync.nus.edu.sg/GDG/survey?survey_uid=136ac03a-ed5e-11f0-8092-06adae5a1497", "_blank", "noopener,noreferrer");
  }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "auto", sm: "6rem" },
        background: "#283C77",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        overflow: "hidden",
        px: 3,
        py: { xs: 2, sm: 0 },
        gap: { xs: 2, sm: 0 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('/console_header.svg'), url('/console_header.svg')`,
          backgroundRepeat: "repeat-x, repeat-x",
          backgroundSize: "150px, 150px",
          backgroundPosition: "-150px 190%, 100px -80%",
          pointerEvents: "none",
        }}
      />

      <Box
        component="img"
        src="/logo.svg"
        alt="Project Dev"
        sx={{
          height: "2.9rem",
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
        }}
      />

      <Button
        onClick={handleButtonClick}
        startIcon={
          isProjectView ? (
            <ArrowBackIcon />
          ) : (
            <PlayCircleIcon
              sx={{
                fontSize: {
                  xs: "1.4rem !important",
                  sm: "1.8rem !important",
                },
              }}
            />
          )
        }
        sx={
          isProjectView
            ? {
                // BACK BUTTON
                px: "1.5rem",
                py: "0.9rem",
                borderRadius: "999px",
                background:
                  "linear-gradient(180deg,#ff7e65 60%,rgb(219, 96, 137)  100%)",
                color: "#283C77",
                fontSize: { xs: "1.1rem", sm: "1.5rem" },
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                width: { xs: "100%", sm: "auto" },
                boxShadow:
                  "0 4px 16px rgba(220, 80, 162, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                border: "1px solid rgba(255, 130, 228, 0.4)",
                transition: "all 0.18s ease",
                position: "relative",
                zIndex: 1,

                "&:hover": {
                  background:
                    "linear-gradient(180deg,#ff7e65 0%, rgb(175, 37, 90) 100%)",
                  boxShadow:
                    "0 6px 22px rgba(168, 141, 211, 0.65), inset 0 1px 0 rgba(255,255,255,0.25)",
                  transform: "translateY(-1px)",
                },

                "&:active": {
                  transform: "translateY(0px)",
                  boxShadow: "0 2px 8px rgba(120, 80, 220, 0.4)",
                },
              }
            : {
                // NORMAL SIGN UP BUTTON
                px: "1.5rem",
                py: "0.9rem",
                borderRadius: "999px",
                background:
                  "linear-gradient(180deg,#56F4D4 60%,rgb(97, 157, 184) 100%)",
                color: "#283C77",
                fontSize: { xs: "1.1rem", sm: "1.5rem" },
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                width: { xs: "100%", sm: "auto" },
                boxShadow:
                  "0 4px 16px rgba(120, 80, 220, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                border: "1px solid rgba(160,130,255,0.4)",
                transition: "all 0.18s ease",
                position: "relative",
                zIndex: 1,

                "&:hover": {
                  background:
                    "linear-gradient(180deg, #56F4D4 0%, rgb(123, 154, 240) 100%)",
                  boxShadow:
                    "0 6px 22px rgba(141, 211, 205, 0.65), inset 0 1px 0 rgba(255,255,255,0.25)",
                  transform: "translateY(-1px)",
                },

                "&:active": {
                  transform: "translateY(0px)",
                  boxShadow: "0 2px 8px rgba(120, 80, 220, 0.4)",
                },
              }
        }
      >
        {isProjectView ? "Back" : "Sign up"}
      </Button>
    </Box>
  );
};

export default BannerTop;