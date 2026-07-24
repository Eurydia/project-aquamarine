import ListSubheader from "@mui/material/ListSubheader";
import { styled } from "@mui/material/styles";

export const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: "500",
  fontSize: "medium",
}));
