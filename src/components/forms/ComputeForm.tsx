import { RestartAltRounded as RestartAltRoundedIcon } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { toIconURL } from "~/assets/icon";
import { ComputeMode, Type$ComputeFormData } from "~/types/query";
import { StyledTextField } from "../styled/StyledTextField";
import { PaddedPaper } from "../surfaces/PaddedPaper";
import { AppFormHooks } from "~/hooks/form-hooks";

export const ComputeForm = AppFormHooks.withFieldGroup({
  defaultValues: {} as Type$ComputeFormData,
  render: ({ group }) => {
    return (
      <PaddedPaper square elevation={2}>
        <group.Field name="computeMode">
          {(f) => (
            <Tabs
              value={f.state.value}
              onChange={(_, value) => f.handleChange(value as ComputeMode)}
            >
              <Tab
                disableRipple
                label="Constraint"
                value={ComputeMode.CONSTRAINT}
              />
              <Tab
                disableRipple
                label="Capacity"
                value={ComputeMode.CAPACITY}
              />
            </Tabs>
          )}
        </group.Field>
        <Grid container spacing={2}>
          <group.Subscribe
            selector={({ values: { computeMode, capacity, constraint } }) => {
              return { computeMode, capacity, constraint };
            }}
          >
            {({ capacity, computeMode, constraint }) => {
              return computeMode === ComputeMode.CONSTRAINT
                ? Object.entries(constraint).map(([label, value]) => (
                    <group.Field name="constraint">
                      {(f) => (
                        <Grid
                          key={label}
                          item
                          xs={12}
                          md={6}
                          display="flex"
                          alignItems="center"
                        >
                          <StyledTextField
                            label={label}
                            maxLength={6}
                            suffix="/min"
                            prefix={<img alt={label} src={toIconURL(label)} />}
                            value={value}
                            onChange={(nextValue) =>
                              f.handleChange((prev) => {
                                const next = { ...prev };
                                next[label] = nextValue;
                                return next;
                              })
                            }
                          />
                          <IconButton
                            size="small"
                            color="primary"
                            children={<RestartAltRoundedIcon />}
                            onClick={() =>
                              f.handleChange((prev) => {
                                const next = { ...prev };
                                next[label] = "";
                                return next;
                              })
                            }
                          />
                        </Grid>
                      )}
                    </group.Field>
                  ))
                : Object.entries(capacity).map(([label, value]) => {
                    return (
                      <group.Field name="capacity">
                        {(f) => (
                          <Grid
                            key={label}
                            item
                            xs={12}
                            md={6}
                            display="flex"
                            alignItems="center"
                          >
                            <StyledTextField
                              label={label}
                              maxLength={6}
                              suffix="/min"
                              prefix={
                                <img alt={label} src={toIconURL(label)} />
                              }
                              value={value}
                              onChange={(nextValue) =>
                                f.handleChange((prev) => {
                                  const next = { ...prev };
                                  next[label] = nextValue;
                                  return next;
                                })
                              }
                            />
                            <IconButton
                              size="small"
                              color="primary"
                              children={<RestartAltRoundedIcon />}
                              onClick={() =>
                                f.handleChange((prev) => {
                                  const next = { ...prev };
                                  next[label] = "";
                                  return next;
                                })
                              }
                            />
                          </Grid>
                        )}
                      </group.Field>
                    );
                  });
            }}
          </group.Subscribe>
        </Grid>
      </PaddedPaper>
    );
  },
});
