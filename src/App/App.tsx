import { ThemeProvider } from "@emotion/react";
import { FC } from "react";
import { Editor } from "~/pages/Editor";
import { theme } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";

export const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Editor />
    </ThemeProvider>
  );
};
