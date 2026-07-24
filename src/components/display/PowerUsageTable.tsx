import { FC } from "react";
import { PaddedPaper } from "~/components/surfaces/PaddedPaper";
import { StyledTableHeadCell } from "~/components/styled/StyledTableHeadCell";
import { formatNumber } from "~/core/formatting";
import { PlacementData, PowerUsageData } from "~/types/query";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

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
