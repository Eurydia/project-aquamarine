import { ExpandMoreRounded, ExpandLessRounded } from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FC, Fragment, ReactNode, useState } from "react";

type CollapsibleProps = {
  children: ReactNode;
  title: string;
};
export const Collapsible: FC<CollapsibleProps> = (props) => {
  const { title, children } = props;
  const [open, setOpen] = useState(true);

  const handleCollapseToggle = () => {
    setOpen(!open);
  };

  const expandIcon = open ? <ExpandMoreRounded /> : <ExpandLessRounded />;

  return (
    <Fragment>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontWeight="500" fontSize="large" color="secondary.main">
          {title}
        </Typography>
        <IconButton
          disableRipple
          size="small"
          color="primary"
          onClick={handleCollapseToggle}
        >
          {expandIcon}
        </IconButton>
      </Stack>
      <Collapse in={open}>
        <Stack spacing={2}>{children}</Stack>
      </Collapse>
    </Fragment>
  );
};
