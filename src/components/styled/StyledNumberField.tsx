import { FC, ReactNode } from "react";
import { StyledTextField } from "./StyledTextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { RestartAltRounded } from "@mui/icons-material";

type SorterFieldProps = {
  prefix?: ReactNode;
  suffix?: string;
  value: string;
  label: string;
  onChange: (v: string) => void;
};
export const StyledNumberField: FC<SorterFieldProps> = (props) => {
  const { prefix, suffix, value, label, onChange } = props;

  return (
    <Stack direction="row" alignItems="center">
      <StyledTextField
        label={label}
        maxLength={6}
        value={value}
        onChange={onChange}
        suffix={suffix}
        prefix={prefix}
      />
      <IconButton
        disableTouchRipple
        size="small"
        color="primary"
        children={<RestartAltRounded />}
        onClick={() => onChange("")}
      />
    </Stack>
  );
};
