import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import BannerTop from "./components/BannerTop";
import ProjectCardEven from "./components/ProjectCardEven";
import ProjectCardOdd from "./components/ProjectCardOdd";

import { getProjects } from "../firebase/projects";
import type { Project } from "../firebase/projects";

import "./Home.css";

export default function Home() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
                console.log("Fetched projects:", data);
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
         <Box className="home-page">
            <BannerTop />

            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh",
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            color: "#283C77",
                            lineHeight: 1.55,
                            fontSize: "3rem",
                            fontWeight: 900,
                        }}
                    >
                        Loading projects...
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gap: "2rem",
                        p: "2rem",
                        justifyItems: "center",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)",
                        },
                    }}
                >
                    {projects.map((project, index) =>
                        index % 2 === 0 ? (
                            <ProjectCardOdd
                                key={project.id}
                                id={project.id ?? ""}
                                title={project.title}
                                description={project.description}
                                coverImage={project.coverImage}
                            />
                        ) : (
                            <ProjectCardEven
                                key={project.id}
                                id={project.id ?? ""}
                                title={project.title}
                                description={project.description}
                                coverImage={project.coverImage}
                            />
                        )
                    )}
                </Box>
            )}
        </Box>
    );
}
