import {
	InputAdornment,
	TextField,
} from "@mui/material";
import {
	ChangeEvent,
	FC,
	ReactNode,
} from "react";

type StyledTextField = {
	placeholder?: string;
	prefix?: ReactNode;
	suffix?: ReactNode;
	disabled?: boolean;
	label: string;
	maxLength: number;
	value: string;
	onChange: (value: string) => void;
};
export const StyledTextField: FC<
	StyledTextField
> = (props) => {
	const {
		placeholder,
		disabled,
		maxLength,
		prefix,
		suffix,
		label,
		value,
		onChange,
	} = props;

	const handleValueChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement
		>,
	) => {
		const nextValue = event.target.value
			.slice(0, maxLength)
			.normalize();
		onChange(nextValue);
	};

	return (
		<TextField
			fullWidth
			placeholder={placeholder}
			disabled={disabled}
			label={label}
			value={value}
			onChange={handleValueChange}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						{prefix}
					</InputAdornment>
				),
				endAdornment: (
					<InputAdornment position="end">
						{suffix}
					</InputAdornment>
				),
			}}
		/>
	);
};
