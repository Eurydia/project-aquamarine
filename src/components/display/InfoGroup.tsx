import { Facility, Proliferator, Recipe } from "@eurydos/dsp-item-registry";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { FC, useRef } from "react";
import { formatNumber } from "~/core/formatting";
import { EditorFormData, PlacementData } from "~/types/query";
import { PaddedPaper } from "../surfaces/PaddedPaper";
import {
  FactoryRounded,
  SpeedRounded,
  DataSaverOffRounded,
  RemoveRounded,
  AddRounded,
  BoltRounded,
  AbcRounded,
  CategoryRounded,
  UsbRounded,
} from "@mui/icons-material";

type PlacementInfoProps = {
  placement: PlacementData;
};
const PlacementInfo: FC<PlacementInfoProps> = (props) => {
  const { placement } = props;
  const { current: items } = useRef([
    {
      icon: <FactoryRounded color="secondary" />,
      render: (x: PlacementData) => x.facilitiesPerArray,
      label: "Facilities per array",
    },
    {
      icon: <FactoryRounded color="secondary" />,
      render: (x: PlacementData) => x.arraysNeeded,
      label: "Arrays needed",
    },
    {
      icon: <FactoryRounded color="secondary" />,
      render: (x: PlacementData) => x.facilitiesNeeded,
      label: "Total facilities needed",
    },
    {
      icon: <FactoryRounded color="secondary" />,
      render: (x: PlacementData) => x.leftoverFacilities,
      label: "Leftover facilities",
    },
  ]);

  const renderedItems = items.map(({ icon, label, render }) => (
    <ListItem key={label} disableGutters>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={render(placement)} />
    </ListItem>
  ));

  return (
    <PaddedPaper square elevation={2}>
      <List dense disablePadding>
        <ListSubheader disableGutters disableSticky>
          Placement
        </ListSubheader>
        {renderedItems}
      </List>
    </PaddedPaper>
  );
};
type RecipeInfoProps = {
  recipe: Recipe;
};
const RecipeInfo: FC<RecipeInfoProps> = (props) => {
  const { recipe } = props;
  const { current: items } = useRef([
    {
      icon: <SpeedRounded color="secondary" />,
      render: (recipe: Recipe) => `${recipe.cycleTimeSecond} s`,
      label: "Cycle time",
    },
    {
      icon: <DataSaverOffRounded color="secondary" />,
      render: (recipe: Recipe) => (recipe.speedupOnly ? "No" : "Yes"),
      label: "Extra products bonus",
    },
    {
      icon: <RemoveRounded color="secondary" />,
      render: (recipe: Recipe) =>
        Object.entries(recipe.materialRecord).map(
          ([label, ratio]) => `${ratio} ${label}`,
        ),
      label: "Materials",
    },
    {
      icon: <AddRounded color="secondary" />,
      render: (recipe: Recipe) =>
        Object.entries(recipe.productRecord).map(
          ([label, ratio]) => `${ratio} ${label}`,
        ),
      label: "Products",
    },
  ]);

  const renderedItems = items.map(({ icon, label, render }) => (
    <ListItem key={label} disableGutters>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={render(recipe)} />
    </ListItem>
  ));

  return (
    <PaddedPaper square elevation={2}>
      <List dense disablePadding>
        <ListSubheader disableGutters disableSticky>
          Recipe Information
        </ListSubheader>
        {renderedItems}
      </List>
    </PaddedPaper>
  );
};
type ProliferatorInfoProps = {
  proliferator: Proliferator;
};
const ProliferatorInfo: FC<ProliferatorInfoProps> = (props) => {
  const { proliferator } = props;
  const { current: items } = useRef([
    {
      icon: <SpeedRounded color="secondary" />,
      render: (prolif: Proliferator) =>
        `${formatNumber((prolif.cycleMultiplier - 1) * 100)}%`,
      label: "Bonus cycle speed",
    },
    {
      icon: <SpeedRounded color="secondary" />,
      render: (prolif: Proliferator) =>
        `${formatNumber((prolif.productMultiplier - 1) * 100)}%`,
      label: "Bonus products per cycle",
    },
    {
      icon: <BoltRounded color="secondary" />,
      render: (prolif: Proliferator) =>
        `${formatNumber((prolif.workConsumptionMultiplier - 1) * 100)}%`,
      label: "Additional work consumption",
    },
  ]);

  const renderedItems = items.map(({ icon, label, render }) => (
    <ListItem key={label} disableGutters>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={render(proliferator)} />
    </ListItem>
  ));

  return (
    <PaddedPaper square elevation={2}>
      <List dense disablePadding>
        <ListSubheader disableGutters disableSticky>
          Proliferator effects
        </ListSubheader>
        {renderedItems}
      </List>
    </PaddedPaper>
  );
};
type FacilityInfoProps = {
  facility: Facility;
};
const FacilityInfo: FC<FacilityInfoProps> = (props) => {
  const { facility } = props;
  const { current: items } = useRef([
    {
      icon: <AbcRounded color="secondary" />,
      render: (facility: Facility) => facility.label,
      label: "Name",
    },
    {
      icon: <CategoryRounded color="secondary" />,
      render: (facility: Facility) => facility.recipeType,
      label: "Category",
    },
    {
      icon: <SpeedRounded color="secondary" />,
      render: (facility: Facility) =>
        `${formatNumber(facility.cycleMultiplier * 100)}%`,
      label: "Cycle speed",
    },
    {
      icon: <UsbRounded color="secondary" />,
      render: (facility: Facility) => facility.connectionCount,
      label: "Sorter connections",
    },
    {
      icon: <BoltRounded color="secondary" />,
      render: (facility: Facility) =>
        `${formatNumber(facility.workConsumptionMW)} MW`,
      label: "Work comsumption",
    },
    {
      icon: <BoltRounded color="secondary" />,
      render: (facility: Facility) =>
        `${formatNumber(facility.idleConsumptionMW)} MW`,
      label: "Idle comsumption",
    },
  ]);

  const renderedItems = items.map(({ icon, label, render }) => (
    <ListItem key={label} disableGutters>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} secondary={render(facility)} />
    </ListItem>
  ));

  return (
    <PaddedPaper square elevation={2}>
      <List dense disablePadding>
        <ListSubheader disableGutters disableSticky>
          Facility information
        </ListSubheader>
        {renderedItems}
      </List>
    </PaddedPaper>
  );
};

type InfoGroupProps = {
  placement: PlacementData;
  data: EditorFormData;
};
export const InfoGroup: FC<InfoGroupProps> = (props) => {
  const { data, placement } = props;
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} display="flex" flexDirection="column" gap={2}>
          <PlacementInfo placement={placement} />
          <RecipeInfo recipe={data.recipe} />
        </Grid>
        <Grid item xs={12} md={6} display="flex" flexDirection="column" gap={2}>
          <FacilityInfo facility={data.facility} />
          <ProliferatorInfo proliferator={data.proliferator} />
        </Grid>
      </Grid>
    </Box>
  );
};
