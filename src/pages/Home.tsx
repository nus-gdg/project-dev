import { Box } from "@mui/material";
import ProjectCardEven from "./components/ProjectCardEven";
import ProjectCardOdd from "./components/ProjectCardOdd";
import BannerTop from "./components/BannerTop";

export default function Home() {
    return (
        <Box>
            <BannerTop/>
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                p: "2rem",

                // responsive direction
                flexDirection: {
                    xs: "column", // phones
                    md: "row",    // desktop+
                },
            }}
        >

            <ProjectCardOdd
                id="1"
                title="Project 1"
                description="Lorem ipsum dolor sit amet..."
            />

            <ProjectCardEven
                id="2"
                title="Project 2"
                description="Lorem ipsum dolor sit amet..."
            />
        </Box>
        </Box>
    );
}