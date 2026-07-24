import { Facility } from "@eurydos/dsp-item-registry";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FC, useRef } from "react";
import { getFacility, getFacilityAll } from "~/assets/get";
import { toIconURL } from "~/assets/icon";

type FacilitySelectProps = {
  value: Facility;
  onChange: (value: Facility) => void;
};
export const FacilitySelect: FC<FacilitySelectProps> = (props) => {
  const { onChange, value } = props;
  const { current: options } = useRef(getFacilityAll());

  const handleChange = (e: SelectChangeEvent<string>) => {
    const next = getFacility(e.target.value);
    if (next === undefined) {
      return;
    }
    onChange(next);
  };

  const items = options.map(({ label }) => (
    <MenuItem key={label} value={label} disableRipple>
      <ListItemIcon>
        <img src={toIconURL(label)} alt={label} />
      </ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </MenuItem>
  ));

  return (
    <Select
      size="small"
      value={value.label}
      onChange={handleChange}
      SelectDisplayProps={{
        style: {
          display: "flex",
          alignItems: "center",
        },
      }}
    >
      {items}
    </Select>
  );
};
