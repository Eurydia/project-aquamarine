import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { FC, ReactNode } from "react";
import { StyledTextField } from "./StyledTextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

type SorterFieldProps = {
  prefix?: ReactNode;
  suffix?: string;
  value: string;
  label: string;
  onChange: (k: string, v: string) => void;
};
export const StyledNumberField: FC<SorterFieldProps> = (props) => {
  const { prefix, suffix, value, label, onChange } = props;

  const handleReset = () => {
    onChange(label, "");
  };
  const handleChange = (k: string) => {
    onChange(label, k);
  };

  return (
    <Stack direction="row" alignItems="center">
      <StyledTextField
        label={label}
        maxLength={6}
        value={value}
        onChange={handleChange}
        suffix={suffix}
        prefix={prefix}
      />
      <IconButton
        disableTouchRipple
        size="small"
        color="primary"
        children={<RestartAltRoundedIcon />}
        onClick={handleReset}
      />
    </Stack>
  );
};
