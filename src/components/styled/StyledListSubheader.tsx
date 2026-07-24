import {
	ListSubheader,
	styled,
} from "@mui/material";

export const StyledListSubheader = styled(
	ListSubheader,
)(({ theme }) => ({
	color: theme.palette.secondary.main,
	fontWeight: "500",
	fontSize: "medium",
}));
