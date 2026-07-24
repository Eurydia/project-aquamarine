import Stack from "@mui/material/Stack";
import { FC, useMemo } from "react";
import { FlowTable } from "~/components/display/FlowTable";
import { InfoGroup } from "~/components/display/InfoGroup";
import { PowerUsageTable } from "~/components/display/PowerUsageTable";
import { computeFlow } from "~/core/solver/solverFlow";
import { computePlacement } from "~/core/solver/solverPlacement";
import { computePowerUsage } from "~/core/solver/solverPowerUsage";
import { Layout } from "~/components/layouts/Layout";
import { ComputeForm } from "~/components/forms/ComputeForm";
import { ConfigForm } from "~/components/forms/ConfigForm";
import { AppFormHooks } from "~/hooks/form-hooks";
import { loadLocalEditorFormData, saveLocalEditorData } from "~/database/local";
import { useSelector } from "@tanstack/react-store";
import { Schema$EditorFormData } from "~/types/query";
import z from "zod/v4";

export const Editor: FC = () => {
  const form = AppFormHooks.useAppForm({
    defaultValues: { data: loadLocalEditorFormData() },
    validators: { onChange: z.object({ data: Schema$EditorFormData }) },
    listeners: {
      onChange: ({
        formApi: {
          state: { values },
        },
      }) => {
        saveLocalEditorData(values.data);
      },
    },
  });

  const formData = useSelector(form.store, ({ values: { data } }) => data);

  const flowData = useMemo(() => computeFlow(formData), [formData]);
  const powerUsageData = useMemo(() => computePowerUsage(formData), [formData]);
  const placementData = useMemo(() => computePlacement(formData), [formData]);

  return (
    <Layout
      slotMain={
        <Stack spacing={2}>
          <ComputeForm form={form} fields={"data"} />
          <FlowTable data={flowData} placement={placementData} />
          <PowerUsageTable placement={placementData} data={powerUsageData} />
          <InfoGroup data={formData} placement={placementData} />
        </Stack>
      }
      slotSide={<ConfigForm form={form} fields={"data"} />}
    />
  );
};
