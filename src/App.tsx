import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "@mui/material";
import mainTheme from "./theme";

function App() {
  
  return (
    <ThemeProvider theme={mainTheme}>
    <AppRoutes />;
  </ThemeProvider>
  )
}

export default App;