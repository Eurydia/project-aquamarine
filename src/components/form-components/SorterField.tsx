import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { FC } from "react";
import { toIconURL } from "~/assets/icon";
import { StyledTextField } from "../styled/StyledTextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

type SorterFieldProps = {
  value: string;
  label: string;
  onChange: (l: string, next: string) => void;
};
export const SorterField: FC<SorterFieldProps> = (props) => {
  const { value, label, onChange } = props;

  const handleReset = () => {
    onChange(label, "");
  };
  const handleChange = (next: string) => {
    onChange(label, next);
  };
  return (
    <Stack direction="row" alignItems="center">
      <StyledTextField
        label={label}
        maxLength={6}
        value={value}
        onChange={handleChange}
        prefix={<img alt={label} src={toIconURL(label)} />}
      />
      <IconButton
        disableRipple
        size="small"
        color="primary"
        children={<RestartAltRoundedIcon />}
        onClick={handleReset}
      />
    </Stack>
  );
};
