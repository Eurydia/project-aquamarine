import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";

export const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.secondary.main,
}));
