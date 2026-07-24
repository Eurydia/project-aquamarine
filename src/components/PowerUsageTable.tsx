import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC } from "react";
import { PaddedPaper } from "~/components/PaddedPaper";
import { StyledTableHeadCell } from "~/components/StyledTableHeadCell";
import { formatNumber } from "~/core/formatting";
import { PlacementData, PowerUsageData } from "~/types/query";

const StyledTableHead: FC = () => {
  return (
    <TableRow>
      <StyledTableHeadCell colSpan={3} children="Power consumption (MW)" />
      <StyledTableHeadCell colSpan={1} align="right" children="Total" />
      <StyledTableHeadCell colSpan={1} align="right" children="Per array" />
      <StyledTableHeadCell colSpan={1} align="right" children="Per facility" />
    </TableRow>
  );
};

type PowerUsageTableProps = {
  data: PowerUsageData;
  placement: PlacementData;
};
export const PowerUsageTable: FC<PowerUsageTableProps> = (props) => {
  const {
    data: { workUsageMWPerFacility, idleUsageMWPerFacility },
    placement: { facilitiesNeeded, facilitiesPerArray },
  } = props;

  const workUsageItems = [
    -workUsageMWPerFacility * facilitiesNeeded,
    -workUsageMWPerFacility * facilitiesPerArray,
    -workUsageMWPerFacility,
  ].map((value, index) => (
    <TableCell
      key={`supply-${index}`}
      colSpan={1}
      align="right"
      children={formatNumber(value)}
    />
  ));

  const idleUsageItems = [
    -idleUsageMWPerFacility * facilitiesNeeded,
    -idleUsageMWPerFacility * facilitiesPerArray,
    -idleUsageMWPerFacility,
  ].map((value, index) => (
    <TableCell
      key={`power-${index}`}
      colSpan={1}
      align="right"
      children={formatNumber(value)}
    />
  ));

  return (
    <PaddedPaper square elevation={2}>
      <TableContainer>
        <Table>
          <TableHead>
            <StyledTableHead />
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} children="Work" />
              {workUsageItems}
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} children="Idle" />
              {idleUsageItems}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </PaddedPaper>
  );
};
