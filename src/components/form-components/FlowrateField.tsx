import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { FC } from "react";
import { toIconURL } from "~/assets/icon";
import { StyledTextField } from "../styled/StyledTextField";
import { RestartAltRounded } from "@mui/icons-material";

type FlowrateFieldProps = {
  value: string;
  label: string;
  onChange: (next: string) => void;
};
export const FlowrateField: FC<FlowrateFieldProps> = (props) => {
  return (
    <Stack direction="row" alignItems="center">
      <StyledTextField
        maxLength={6}
        suffix="/min"
        label={props.label}
        value={props.value}
        onChange={props.onChange}
        prefix={<img alt={props.label} src={toIconURL(props.label)} />}
      />
      <IconButton
        disableRipple
        size="small"
        color="primary"
        children={<RestartAltRounded />}
        onClick={() => props.onChange("")}
      />
    </Stack>
  );
};
