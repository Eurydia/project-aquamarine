import {
	ListItemIcon,
	ListItemText,
	MenuItem,
	TextField,
} from "@mui/material";
import { ChangeEvent, FC } from "react";

type StyledSelectProps = {
	label: string;
	value: string;
	onChange: (next: string) => void;
	optionToIcon: (opt: string) => string;
	options: string[];
	disabledOptions: string[];
};
export const StyledSelect: FC<
	StyledSelectProps
> = (props) => {
	const {
		label,
		value,
		optionToIcon,
		onChange,
		options,
		disabledOptions,
	} = props;

	const handleChange = (
		event: ChangeEvent<
			HTMLTextAreaElement | HTMLInputElement
		>,
	) => {
		onChange(event.target.value);
	};

	const _options = options.filter(
		(option) => !disabledOptions.includes(option),
	);

	const renderedOptions = _options.map((opt) => (
		<MenuItem
			key={opt}
			value={opt}
		>
			<ListItemIcon>
				<img
					alt={opt}
					src={optionToIcon(opt)}
				/>
			</ListItemIcon>
			<ListItemText>{opt}</ListItemText>
		</MenuItem>
	));
	const renderedDisableOptions =
		disabledOptions.map((opt) => (
			<MenuItem
				disabled
				key={opt}
				value={opt}
			>
				{opt}
			</MenuItem>
		));

	return (
		<TextField
			select
			fullWidth
			size="small"
			label={label}
			value={value}
			onChange={handleChange}
			SelectProps={{
				SelectDisplayProps: {
					style: {
						display: "flex",
						alignItems: "center",
					},
				},
			}}
		>
			{renderedOptions}
			{renderedDisableOptions}
		</TextField>
	);
};
