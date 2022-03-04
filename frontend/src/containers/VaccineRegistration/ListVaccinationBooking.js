import {
  Table,
  Box,
  Button,
  CssBaseline,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Container,
} from "@mui/material";
import { Link } from 'react-router-dom';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { Component } from "react";

function getBooking() {
  return [
    {
      id: 1,
      name: "Tan Ah Kow",
      centerName: "Bukit Timah CC",
      centerId: 3,
      startTime: new Date("2021-12-01T09:00:00"),
    },
    {
      id: 2,
      name: "Jean Lee Ah Meow",
      centerName: "Bukit Timah CC",
      centerId: 3,
      startTime: new Date("2021-12-01T10:00:00"),
    },
    {
      id: 3,
      name: "Lew Ah Boi",
      centerName: "Bukit Timah CC",
      centerId: 3,
      startTime: new Date("2021-12-01T11:00:00"),
    },
  ];
}

export class VaccineRegistrationListing extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container>
          <Box sx={{mt: 8}}>
            <Typography component="h1" variant="h5">
              Active Booking
            </Typography>
            <TableContainer component={Box}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Center Name</TableCell>
                    <TableCell align="left">Start Time</TableCell>
                    <TableCell align="left">&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getBooking().map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.centerName}</TableCell>
                      <TableCell align="left">
                        {row.startTime.toString()}
                      </TableCell>
                      <TableCell align="left">
                        <Button component={Link} to='/bookings/1'>
                          <ModeEditIcon />
                        </Button>
                        <Button>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}
