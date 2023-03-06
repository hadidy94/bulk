import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@/components/UI/Button';

export default function UnitTable({tableData}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Unit</TableCell>
            <TableCell align="right">Length</TableCell>
            <TableCell align="right">Length unit</TableCell>
            <TableCell align="right">Width</TableCell>
            <TableCell align="right">Width unit</TableCell>
            <TableCell align="right">Height</TableCell>
            <TableCell align="right">Height unit</TableCell>
            <TableCell align="right">Weight</TableCell>
            <TableCell align="right">Weight unit</TableCell>
            <TableCell align="right">Contains</TableCell>
            <TableCell align="right">Barcode</TableCell>
            <TableCell align="right">Images</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow
              key={row.unit}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.unit}
              </TableCell>
              <TableCell align="right">{row.length}</TableCell>
              <TableCell align="right">{row.length_unit}</TableCell>
              <TableCell align="right">{row.width}</TableCell>
              <TableCell align="right">{row.width_unit}</TableCell>
              <TableCell align="right">{row.height}</TableCell>
              <TableCell align="right">{row.height_unit}</TableCell>
              <TableCell align="right">{row.weight}</TableCell>
              <TableCell align="right">{row.weight_unit}</TableCell>
              <TableCell align="right">{row.contains}</TableCell>
              <TableCell align="right">{row.barcode}</TableCell>
              <TableCell align="right">
              <Button className="btn btn-gray">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}