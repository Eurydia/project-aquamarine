import { FC } from "react";
import { getProliferator } from "~/assets/get";
import { proliferatorToIconURL, toIconURL } from "~/assets/icon";
import { PaddedPaper } from "~/components/surfaces/PaddedPaper";
import { StyledTableHeadCell } from "~/components/styled/StyledTableHeadCell";
import { formatNumber } from "~/core/formatting";
import { FlowData, PlacementData } from "~/types/query";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type StyledTableRowProps = {
  label: string;
  perFacility: number;
  perArray: number;
  perTotal: number;
};
const StyledTableRow: FC<StyledTableRowProps> = (props) => {
  const { label, perArray, perFacility, perTotal } = props;

  const items = [perTotal, perArray, perFacility];
  const tableCells = items.map((data, index) => (
    <TableCell
      key={`${label}-${index}`}
      colSpan={1}
      align="right"
      children={formatNumber(data)}
    />
  ));

  let iconURL = toIconURL(label);
  if (label.includes("(materials)") || label.includes("(products)")) {
    const p = getProliferator(
      label.replaceAll("(materials)", "").replaceAll("(products)", "").trim(),
    );
    if (p !== undefined) {
      iconURL = proliferatorToIconURL(p);
    }
  }
  return (
    <TableRow>
      <TableCell
        colSpan={1}
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img alt={label} src={iconURL} />
      </TableCell>
      <TableCell colSpan={2} children={label} />
      {tableCells}
    </TableRow>
  );
};

const StyledTableHead: FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={1} />
      <StyledTableHeadCell colSpan={2} children="Flow (per minute)" />
      <StyledTableHeadCell colSpan={1} align="right" children="Total" />
      <StyledTableHeadCell colSpan={1} align="right" children="Per array" />
      <StyledTableHeadCell colSpan={1} align="right" children="Per facility" />
    </TableRow>
  );
};

type FlowTableProps = {
  data: FlowData;
  placement: PlacementData;
};
export const FlowTable: FC<FlowTableProps> = (props) => {
  const { data, placement } = props;
  const { materialFlowPerMinutePerFacility, productFlowPerMinutePerFacility } =
    data;
  const { facilitiesNeeded, facilitiesPerArray } = placement;

  const renderedMaterialRows = Object.entries(
    materialFlowPerMinutePerFacility,
  ).map(([label, value], index) => (
    <StyledTableRow
      key={`m-${label}-${index}`}
      label={label}
      perFacility={-value}
      perArray={-value * facilitiesNeeded}
      perTotal={-value * facilitiesPerArray}
    />
  ));

  const renderedProductRows = Object.entries(
    productFlowPerMinutePerFacility,
  ).map(([label, value], index) => (
    <StyledTableRow
      key={`prod-${label}-${index}`}
      label={label}
      perFacility={value}
      perArray={value * facilitiesNeeded}
      perTotal={value * facilitiesPerArray}
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
            {renderedMaterialRows}
            {renderedProductRows}
          </TableBody>
        </Table>
      </TableContainer>
    </PaddedPaper>
  );
};
