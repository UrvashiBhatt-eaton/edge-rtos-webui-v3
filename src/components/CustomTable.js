import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function CustomTable(props) {
  let headerData = props.data[0];
  let rowData = props.data[1];

  return (
    <TableContainer style={{ padding: "8px 16px 8px 16px" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headerData &&
              headerData.map((colName, index) => (
                <TableCell key={index} style={{ border: "1px black solid" }}>
                  {colName}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData &&
            rowData.map((row, index) => (
              <TableRow key={index}>
                {row.map((celVal, i) => (
                  <TableCell key={i} style={{ border: "1px black solid" }} component="th" scope="row">
                    {celVal}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
