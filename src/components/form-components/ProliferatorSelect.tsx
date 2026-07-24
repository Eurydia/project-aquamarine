import { Proliferator, ProliferatorMode } from "@eurydos/dsp-item-registry";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FC, useRef } from "react";
import { getProliferator, getProliferatorAll } from "~/assets/get";
import { proliferatorToIconURL } from "~/assets/icon";

type ProlfieratorSelectProps = {
  value: Proliferator;
  onChange: (value: Proliferator) => void;
  speedupOnly: boolean;
};
export const ProliferatorSelect: FC<ProlfieratorSelectProps> = (props) => {
  const { onChange, value, speedupOnly } = props;

  const { current: options } = useRef(getProliferatorAll());

  const handleChange = (e: SelectChangeEvent<string>) => {
    const next = getProliferator(e.target.value);
    if (next === undefined) {
      return;
    }
    onChange(next);
  };

  const activeOptions: Proliferator[] = [];
  const disabledOptions: Proliferator[] = [];
  for (const opt of options) {
    if (speedupOnly && opt.mode === ProliferatorMode.EXTRA_PRODUCTS) {
      disabledOptions.push(opt);
    } else {
      activeOptions.push(opt);
    }
  }

  const activeItems = activeOptions.map((item) => {
    const { label } = item;
    return (
      <MenuItem key={label} value={label} disableRipple>
        {label !== "None" && (
          <ListItemIcon>
            <img src={proliferatorToIconURL(item)} alt={label} />
          </ListItemIcon>
        )}
        <ListItemText>{label}</ListItemText>
      </MenuItem>
    );
  });

  const disabledItems = disabledOptions.map(({ label }) => (
    <MenuItem disabled key={label} value={label} disableRipple>
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
      {activeItems}
      {disabledItems}
    </Select>
  );
};
