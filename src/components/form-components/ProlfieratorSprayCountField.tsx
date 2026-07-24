import { RestartAltRounded } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { FC } from "react";
import { StyledTextField } from "../styled/StyledTextField";

type ProlfieratorSprayCountFieldProps = {
  value: string;
  onChange: (next: string) => void;
  defaultValue: string;
  disabled: boolean;
};
export const ProlfieratorSprayCountField: FC<
  ProlfieratorSprayCountFieldProps
> = (props) => {
  const { defaultValue, disabled, onChange, value } = props;

  const handleReset = () => {
    onChange(defaultValue);
  };

  return (
    <Stack direction="row" alignItems="center">
      <StyledTextField
        disabled={disabled}
        placeholder={defaultValue}
        maxLength={6}
        label="Spray Count"
        value={value}
        onChange={onChange}
        suffix="sprays"
      />
      <IconButton
        disableRipple
        disabled={disabled}
        size="small"
        color="primary"
        children={<RestartAltRounded />}
        onClick={handleReset}
      />
    </Stack>
  );
};
