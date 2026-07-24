import { RestartAltRounded } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { FC, ReactNode } from "react";
import { StyledTextField } from "./StyledTextField";

type SorterFieldProps = {
	prefix?: ReactNode;
	suffix?: string;
	value: string;
	label: string;
	onChange: (k: string, v: string) => void;
};
export const StyledNumberField: FC<
	SorterFieldProps
> = (props) => {
	const {
		prefix,
		suffix,
		value,
		label,
		onChange,
	} = props;

	const handleReset = () => {
		onChange(label, "");
	};
	const handleChange = (k: string) => {
		onChange(label, k);
	};

	return (
		<Stack
			direction="row"
			alignItems="center"
		>
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
				children={<RestartAltRounded />}
				onClick={handleReset}
			/>
		</Stack>
	);
};
