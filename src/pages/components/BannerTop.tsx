import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

const BannerTop: React.FC = () => {
  const navigate = useNavigate();

  const handleViewProject = () => {
    navigate(`../project/1`);
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
        position: "sticky",  // 👈 changed from "relative"
        top: 0,              // 👈 add this
        zIndex: 100,         // 👈 add this
        overflow: "hidden",
        px: 3,
        py: { xs: 2, sm: 0 },
        gap: { xs: 2, sm: 0 },
      }}
    >
      {/* Background SVG layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('console_header.svg'), url('console_header.svg')`,
          backgroundRepeat: "repeat-x, repeat-x",
          backgroundSize: "150px, 150px",
          backgroundPosition: "-150px 190%, 100px -80%",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <Box
        component="img"
        src="logo.svg"
        alt="Project Dev"
        sx={{
          height: "2.9rem",
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
        }}
      />

      <Button
        onClick={handleViewProject}
        startIcon={<PlayCircleIcon sx={{ fontSize: { xs: "1.4rem !important", sm: "1.8rem !important" } }} />}
        sx={{
          px: "1.5rem",
          py: "0.9rem",
          borderRadius: "999px",
          background: "linear-gradient(180deg,#56F4D4 60%,rgb(97, 157, 184) 100%)",
          color: "#283C77",
          fontSize: { xs: "1.1rem", sm: "1.5rem" },
          fontWeight: 900,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          width: { xs: "100%", sm: "auto" },
          boxShadow: "0 4px 16px rgba(120, 80, 220, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
          border: "1px solid rgba(160,130,255,0.4)",
          transition: "all 0.18s ease",
          position: "relative",
          zIndex: 1,
          "&:hover": {
            background: "linear-gradient(180deg, #56F4D4 0%, rgb(123, 154, 240) 100%)",
            boxShadow: "0 6px 22px rgba(141, 211, 205, 0.65), inset 0 1px 0 rgba(255,255,255,0.25)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0px)",
            boxShadow: "0 2px 8px rgba(120, 80, 220, 0.4)",
          },
        }}
      >
        Sign up
      </Button>
    </Box>
  );
};

export default BannerTop;