import { createTheme } from "@mui/material/styles";
import { type CSSProperties } from "react";

import "@fontsource-variable/nunito"
import "@fontsource-variable/overpass"

const mainTheme = createTheme({
    palette: {
        //color=
        primary: {
            //primary
            main: "#20053D", 
        },
        secondary: {
            //secondary
            main: "#67F5D8", // cyan
        },
        text: {
            primary: "#20053D", //textPrimary
            secondary: "#20053D", //textSecondary
        },
        background: {
            default: "#DBEDFF"
        }
    },
    typography: {
        fontFamily: '"Overpass", sans-serif', //default font
        h1: {
            fontSize: "5rem",
        },
        h2: {
            fontSize: "2rem",
            fontWeight: "600",
        },
        h3: {
            fontSize: "1.5rem",
            fontWeight: "600",
        },
        h4: {
            fontSize: " 1.2rem",
            fontWeight: "bold",
        },
        h5: {
            fontSize: "1.1rem",
            fontWeight: "bold",
        },
        body1: {
            fontSize: "1.1rem",
        },
        button: {
            fontSize: "1rem",
            textTransform: "none",
            fontWeight: "600",
        },
        caption: {
            fontSize: "1rem",
        },
        subtitle1: {
            fontSize: "0.9rem",
            lineHeight: 1
        },
        subtitle2: {
            fontSize: "0.8rem",
            fontWeight: 300
        },
        overline: {},
        link: {
            color: "#32F9ED",
            textDecoration: "underline",
        }
    },
});


declare module "@mui/material/styles" {
  interface TypographyVariants {
    h2TitleFont: CSSProperties;
    h3NoBold: CSSProperties;
    h3TitleFont: CSSProperties;
    h4TitleFont: CSSProperties;
    h5TitleFont: CSSProperties;
    link: CSSProperties;
  }

  interface TypographyVariantsOptions {
    h2TitleFont?: CSSProperties;
    h3NoBold?: CSSProperties;
    h3TitleFont?: CSSProperties;
    h4TitleFont?: CSSProperties;
    h5TitleFont?: CSSProperties;
    link?: CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    h2TitleFont: true;
    h3NoBold: true;
    h3TitleFont: true;
    h4TitleFont: true;
    h5TitleFont: true;
    link: true;
  }
}

//example: <Typography variant="h1" color="textPrimary">

export default mainTheme;
