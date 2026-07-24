import { RestartAltRounded as RestartAltRoundedIcon } from "@mui/icons-material";
import { FC } from "react";
import { toIconURL } from "~/assets/icon";
import { StyledTextField } from "../styled/StyledTextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

export const SorterField: FC<{
  value: string;
  label: string;
  onChange: (next: string) => void;
}> = (props) => {
  return (
    <Stack direction="row" alignItems="center">
      <StyledTextField
        label={props.label}
        maxLength={6}
        value={props.value}
        onChange={props.onChange}
        prefix={<img alt={props.label} src={toIconURL(props.label)} />}
      />
      <IconButton
        disableRipple
        size="small"
        color="primary"
        children={<RestartAltRoundedIcon />}
        onClick={() => props.onChange("")}
      />
    </Stack>
  );
};
