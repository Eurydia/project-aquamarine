import { TableCell, styled } from "@mui/material";

export const StyledTableHeadCell = styled(
	TableCell,
)(({ theme }) => ({
	color: theme.palette.secondary.main,
}));
