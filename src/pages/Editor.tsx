import { Stack } from "@mui/material";
import { FC } from "react";
import { ComputeForm } from "~/components/ComputeForm";
import { ConfigForm } from "~/components/ConfigForm";
import { FlowTable } from "~/components/display/FlowTable";
import { InfoGroup } from "~/components/display/InfoGroup";
import { PowerUsageTable } from "~/components/display/PowerUsageTable";
import { computeFlow } from "~/core/solver/solverFlow";
import { computePlacement } from "~/core/solver/solverPlacement";
import { computePowerUsage } from "~/core/solver/solverPowerUsage";
import { useEditorForm } from "~/hooks/useEditorForm";
import { Layout } from "~/components/layouts/Layout";

export const Editor: FC = () => {
  const [data, handlers] = useEditorForm();

  const flowData = computeFlow(data);
  const powerUsageData = computePowerUsage(data);
  const placementData = computePlacement(data);

  return (
    <Layout
      slotMain={
        <Stack spacing={2}>
          <ComputeForm data={data} handlers={handlers} />
          <FlowTable data={flowData} placement={placementData} />
          <PowerUsageTable placement={placementData} data={powerUsageData} />
          <InfoGroup data={data} placement={placementData} />
        </Stack>
      }
      slotSide={<ConfigForm data={data} handlers={handlers} />}
    />
  );
};
