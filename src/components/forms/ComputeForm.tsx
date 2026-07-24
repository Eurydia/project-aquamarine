import { RestartAltRounded as RestartAltRoundedIcon } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { FC, SyntheticEvent } from "react";
import { toIconURL } from "~/assets/icon";
import { EditorFormData, EditorFormHandlers } from "~/types/query";
import { StyledTextField } from "../styled/StyledTextField";
import { PaddedPaper } from "../surfaces/PaddedPaper";

type ComputeFormProps = {
  data: EditorFormData;
  handlers: EditorFormHandlers;
};
export const ComputeForm: FC<ComputeFormProps> = (props) => {
  const { data, handlers } = props;

  const handleComputeModeChange = (
    _: SyntheticEvent<Element, Event>,
    value: string,
  ) => {
    handlers.handleComputeModeChange(value);
  };

  const items = data.computeMode === "0" ? data.constraint : data.capacity;

  const fn =
    data.computeMode === "0"
      ? handlers.handleConstraintUpdate
      : handlers.handleCapacityUpdate;

  const itemFields = Object.entries(items).map(([label, value]) => (
    <Grid key={label} item xs={12} md={6} display="flex" alignItems="center">
      <StyledTextField
        label={label}
        maxLength={6}
        suffix="/min"
        prefix={<img alt={label} src={toIconURL(label)} />}
        value={value}
        onChange={(nextValue) => fn(label, nextValue)}
      />
      <IconButton
        size="small"
        color="primary"
        children={<RestartAltRoundedIcon />}
        onClick={() => fn(label, "")}
      />
    </Grid>
  ));

  return (
    <PaddedPaper square elevation={2}>
      <Tabs value={data.computeMode} onChange={handleComputeModeChange}>
        <Tab disableRipple label="Constraint" value="0" />
        <Tab disableRipple label="Capacity" value="1" />
      </Tabs>
      <Grid container spacing={2}>
        {itemFields}
      </Grid>
    </PaddedPaper>
  );
};
