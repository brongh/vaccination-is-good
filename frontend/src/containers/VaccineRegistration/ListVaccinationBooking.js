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
import React, { useState, useEffect } from "react";
import { instance } from "../../services/api";

const VaccineRegistrationListing = () => {
  const [data, setData] = useState()
  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    instance.get("/bookings/slots").then((res) => {
      setData(res.data)
    })
  }, [deleted])

  const handleDelete = async (bookingId, userId) => {
    console.log(bookingId, userId)
    await instance.delete(`/bookings/user?bookingId=${bookingId}&userId=${userId}`).then((res) => {
      if (res.data.message === "Success") {
        setDeleted(!deleted)

      }
    })
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box sx={{ mt: 8 }}>
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
                {data && data.map((row, index) => {
                  const time = new Date(row.timeSlot)
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.patient.name}
                      </TableCell>
                      <TableCell align="left">{row.center.name}</TableCell>
                      <TableCell align="left">
                        {time.toString()}
                      </TableCell>
                      <TableCell align="left">
                        <Button component={Link} to={`/bookings/${row._id}`}>
                          <ModeEditIcon />
                        </Button>
                        <Button onClick={() => handleDelete(row._id, row.patient._id)}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default VaccineRegistrationListing

