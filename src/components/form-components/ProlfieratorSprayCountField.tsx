import { FC } from "react";
import { StyledTextField } from "../styled/StyledTextField";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { RestartAltRounded } from "@mui/icons-material";

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
