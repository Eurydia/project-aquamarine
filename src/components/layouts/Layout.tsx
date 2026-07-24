import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FC, ReactNode } from "react";
import { PaddedPaper } from "~/components/surfaces/PaddedPaper";

type LayoutProps = {
  slotSide: ReactNode;
  slotMain: ReactNode;
};
export const Layout: FC<LayoutProps> = (props) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { slotMain, slotSide } = props;

  if (isSmallScreen) {
    return (
      <PaddedPaper square elevation={0}>
        <PaddedPaper square elevation={2}>
          {slotSide}
        </PaddedPaper>
        {slotMain}
      </PaddedPaper>
    );
  }
  return (
    <Paper square elevation={0}>
      <Grid container columns={10}>
        <Grid item md padding={4}>
          {slotMain}
        </Grid>
        <Grid item md={3}>
          <PaddedPaper square elevation={2}>
            {slotSide}
          </PaddedPaper>
        </Grid>
      </Grid>
    </Paper>
  );
};
