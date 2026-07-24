import Paper from "@mui/material/Paper";
import styled from "@mui/material/styles/styled";

export const PaddedPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));
