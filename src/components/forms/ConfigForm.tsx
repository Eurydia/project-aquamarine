import {
  GAME_VERSION,
  Proliferator,
  ProliferatorMode,
} from "@eurydos/dsp-item-registry";
import { Collapsible } from "~/components/surfaces/Collapsible";
import { FacilitySelect } from "~/components/form-components/FacilitySelect";
import { FlowrateField } from "~/components/form-components/FlowrateField";
import { ProlfieratorSprayCountField } from "~/components/form-components/ProlfieratorSprayCountField";
import { ProliferatorSelect } from "~/components/form-components/ProliferatorSelect";
import { RecipeSelect } from "~/components/form-components/RecipeSelect";
import { Type$EditorFormData } from "~/types/query";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppFormHooks } from "~/hooks/form-hooks";
import { getProliferatorWithMode, getRecipeWithType } from "~/assets/get";
import { countRecordValue } from "~/core/validate";
import { tryParseInt } from "~/core/parsing";
import { SorterField } from "../form-components/SorterField";

export const ConfigForm = AppFormHooks.withFieldGroup({
  defaultValues: {} as Type$EditorFormData,
  render: ({ group }) => {
    return (
      <Stack spacing={2}>
        <Typography fontWeight="600" fontSize="x-large" color="secondary.main">
          Configuration
        </Typography>
        <Typography fontWeight="400" fontSize="small">
          DSP version: {GAME_VERSION}
        </Typography>
        <Collapsible title="Manufacturing">
          <group.Field
            name="facility"
            listeners={{
              onChange: ({ value }) => {
                const nextRecipe = getRecipeWithType(value.recipeType);
                if (!nextRecipe) {
                  return;
                }
                group.setFieldValue("recipe", nextRecipe);
              },
            }}
          >
            {(f) => (
              <FacilitySelect value={f.state.value} onChange={f.handleChange} />
            )}
          </group.Field>
          <group.Subscribe
            selector={({ values: { facility, proliferator } }) => ({
              facility,
              proliferator,
            })}
          >
            {({ facility, proliferator }) => (
              <group.Field
                name="recipe"
                listeners={{
                  onChange: ({ value }) => {
                    if (
                      value.speedupOnly &&
                      proliferator.mode === ProliferatorMode.EXTRA_PRODUCTS
                    ) {
                      const nextProlif = getProliferatorWithMode(
                        ProliferatorMode.PRODUCTION_SPEEDUP,
                      );
                      if (nextProlif === undefined) {
                        return;
                      }
                      group.setFieldValue(
                        "proliferator",
                        nextProlif as Exclude<Proliferator, "mode"> & {
                          mode: string;
                        },
                      );
                    }
                    const nextFlowrate: Record<string, string> = {};
                    const nextConstraint: Record<string, string> = {};
                    const nextCapacity: Record<string, string> = {};
                    for (const k in value.materialRecord) {
                      nextConstraint[k] = "";
                      nextFlowrate[k] = "";
                    }
                    for (const k in value.productRecord) {
                      nextCapacity[k] = "";
                      nextFlowrate[k] = "";
                    }
                    group.setFieldValue("flowrate", nextFlowrate);
                    group.setFieldValue("capacity", nextCapacity);
                    group.setFieldValue("constraint", nextConstraint);
                  },
                }}
              >
                {(f) => (
                  <RecipeSelect
                    value={f.state.value}
                    onChange={f.handleChange}
                    recipeType={facility.recipeType}
                  />
                )}
              </group.Field>
            )}
          </group.Subscribe>
        </Collapsible>
        <Collapsible title="Transport capacity">
          <Stack spacing={1}>
            <group.Subscribe
              selector={({ values: { flowrate, facility } }) => {
                return { flowrate, facility };
              }}
            >
              {({ flowrate, facility }) => {
                return (
                  <group.Field name="flowrate">
                    {(f) =>
                      Object.entries(flowrate).map(([label, value]) => (
                        <FlowrateField
                          key={label}
                          value={value}
                          label={label}
                          onChange={(nextValue) =>
                            f.handleChange((prev) => {
                              const next = { ...prev };
                              const maxFlow = facility.connectionCount * 7200;
                              const takenFlow = countRecordValue(
                                label,
                                prev,
                                maxFlow,
                              );
                              const leftover = maxFlow - takenFlow;
                              next[label] = Math.max(
                                0,
                                Math.min(tryParseInt(nextValue) ?? 0, leftover),
                              ).toString();
                              return next;
                            })
                          }
                        />
                      ))
                    }
                  </group.Field>
                );
              }}
            </group.Subscribe>
          </Stack>
        </Collapsible>
        <Collapsible title="Proliferation">
          <group.Subscribe selector={({ values: { recipe } }) => recipe}>
            {(recipe) => (
              <group.Field
                name="proliferator"
                listeners={{
                  onChange: ({ value }) => {
                    group.setFieldValue(
                      "proliferatorSprayCount",
                      value.sprayCount.toString(),
                    );
                  },
                }}
              >
                {(f) => (
                  <ProliferatorSelect
                    speedupOnly={recipe.speedupOnly}
                    value={f.state.value}
                    onChange={f.handleChange}
                  />
                )}
              </group.Field>
            )}
          </group.Subscribe>
          <group.Subscribe
            selector={({ values: { proliferator } }) => proliferator}
          >
            {(proliferator) => (
              <group.Field name="proliferatorSprayCount">
                {(f) => (
                  <ProlfieratorSprayCountField
                    defaultValue={proliferator.sprayCount.toString()}
                    disabled={proliferator.label === "None"}
                    value={f.state.value}
                    onChange={f.handleChange}
                  />
                )}
              </group.Field>
            )}
          </group.Subscribe>
        </Collapsible>
        <Collapsible title="Sorter connections">
          <group.Subscribe
            selector={({ values: { sorter, facility } }) => {
              return { sorter, facility };
            }}
          >
            {({ sorter, facility }) => {
              return (
                <group.Field name="sorter">
                  {(f) =>
                    Object.entries(sorter).map(([label, value]) => (
                      <SorterField
                        key={label}
                        value={value}
                        label={label}
                        onChange={(nextValue) =>
                          f.handleChange((prev) => {
                            const next = { ...prev };
                            const takenPorts = countRecordValue(
                              label,
                              next,
                              facility.connectionCount,
                            );
                            const leftover =
                              facility.connectionCount - takenPorts;
                            next[label] = Math.max(
                              0,
                              Math.min(tryParseInt(nextValue) ?? 0, leftover),
                            ).toString();

                            return next;
                          })
                        }
                      />
                    ))
                  }
                </group.Field>
              );
            }}
          </group.Subscribe>
        </Collapsible>
      </Stack>
    );
  },
});
