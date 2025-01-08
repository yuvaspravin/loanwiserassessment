import { createTheme, ThemeProvider } from "@mui/material";
import "./App.css";
import MainPage from "./components/MainPage";

function App() {
  const theme = createTheme({
    palette: {
      common: {
        black: "#000",
        white: "#fff",
      },
      primary: {
        main: "#1976d2",
        light: "#1976d2",
        dark: "#1976d2",
      },
    },
    typography: {
      button: {
        fontSize: "12px",
      },
    },
  });
  return (
    <>
      <div>
        <ThemeProvider theme={theme}>
          <MainPage />
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
