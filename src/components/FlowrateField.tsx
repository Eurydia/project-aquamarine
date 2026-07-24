import { RestartAltRounded } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { FC } from "react";
import { toIconURL } from "~/assets/icon";
import { StyledTextField } from "./StyledTextField";

type FlowrateFieldProps = {
  value: string;
  label: string;
  onChange: (l: string, next: string) => void;
};
export const FlowrateField: FC<FlowrateFieldProps> = (props) => {
  const handleReset = () => {
    onChange(label, "");
  };
  const handleChange = (next: string) => {
    onChange(label, next);
  };

  const { value, label, onChange } = props;
  return (
    <Stack direction="row" alignItems="center">
      <StyledTextField
        label={label}
        maxLength={6}
        value={value}
        suffix="/min"
        onChange={handleChange}
        prefix={<img alt={label} src={toIconURL(label)} />}
      />
      <IconButton
        disableRipple
        size="small"
        color="primary"
        children={<RestartAltRounded />}
        onClick={handleReset}
      />
    </Stack>
  );
};
