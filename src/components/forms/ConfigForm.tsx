import { GAME_VERSION } from "@eurydos/dsp-item-registry";
import { FC } from "react";
import { toIconURL } from "~/assets/icon";
import { Collapsible } from "~/components/surfaces/Collapsible";
import { FacilitySelect } from "~/components/form-components/FacilitySelect";
import { FlowrateField } from "~/components/form-components/FlowrateField";
import { ProlfieratorSprayCountField } from "~/components/form-components/ProlfieratorSprayCountField";
import { ProliferatorSelect } from "~/components/form-components/ProliferatorSelect";
import { RecipeSelect } from "~/components/form-components/RecipeSelect";
import { EditorFormData, EditorFormHandlers } from "~/types/query";
import { StyledNumberField } from "../styled/StyledNumberField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type ConfigFormProps = {
  data: EditorFormData;
  handlers: EditorFormHandlers;
};
export const ConfigForm: FC<ConfigFormProps> = (props) => {
  const { data, handlers } = props;

  const flowrateFieldGroup = Object.entries(data.flowrate).map(
    ([label, value]) => (
      <FlowrateField
        key={label}
        value={value}
        label={label}
        onChange={handlers.handleFlowrateChange}
      />
    ),
  );

  const sorterFieldGroup = Object.entries(data.sorter).map(([label, value]) => (
    <StyledNumberField
      prefix={<img src={toIconURL(label)} alt={label} />}
      key={label}
      label={label}
      value={value}
      onChange={handlers.handleSorterChange}
    />
  ));

  return (
    <Stack spacing={2}>
      <Typography fontWeight="600" fontSize="x-large" color="secondary.main">
        Configuration
      </Typography>
      <Typography fontWeight="400" fontSize="small">
        DSP version: {GAME_VERSION}
      </Typography>
      <Collapsible title="Manufacturing">
        <FacilitySelect
          value={data.facility}
          onChange={handlers.handleFacilityChange}
        />
        <RecipeSelect
          value={data.recipe}
          onChange={handlers.handleRecipeChange}
          recipeType={data.facility.recipeType}
        />
      </Collapsible>
      <Collapsible title="Transport capacity">
        <Stack spacing={1}>{flowrateFieldGroup}</Stack>
      </Collapsible>
      <Collapsible title="Proliferation">
        <ProliferatorSelect
          value={data.proliferator}
          speedupOnly={data.recipe.speedupOnly}
          onChange={handlers.handleProliferatorChange}
        />
        <ProlfieratorSprayCountField
          defaultValue={data.proliferator.sprayCount.toString()}
          value={data.proliferatorSprayCount}
          disabled={data.proliferator.label === "None"}
          onChange={handlers.handleProliferatorSprayCountChange}
        />
      </Collapsible>
      <Collapsible title="Sorter connections">
        <Stack spacing={1}>{sorterFieldGroup}</Stack>
      </Collapsible>
    </Stack>
  );
};
