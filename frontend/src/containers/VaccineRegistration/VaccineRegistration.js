import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import DateTimePicker from '@mui/lab/DateTimePicker';
import React, { useEffect, useState } from "react";
import { instance } from "../../services/api";

const VaccineRegistration = () => {
  const [centers, setCenters] = useState([])
  const [selectedCenter, setSelectedCenter] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [vacc, setVacc] = useState({})
  const [output, setOutput] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    instance.get("/bookings/").then((data) => {
      setCenters(data.data)
    })
  }, [])

  const [slots, setSlots] = useState([])

  useEffect(() => {
    if (vacc._id) {
      const takenSlots = vacc.bookings;
      const allSlots = vacc.availableSlots;
      const takenMap = new Map()
      takenSlots.forEach((item) => {
        takenMap.has(item.timeSlot) ? takenMap.set(item.timeSlot, (takenMap.get(item.timeSlot) + 1)) :
          takenMap.set(item.timeSlot, 1)
      })
      const updatedSlots = allSlots.map((item) => {
        const unavail = takenMap.has(item.time) ? takenMap.get(item.time) : 0;
        return {
          qty: item.qty - unavail,
          time: item.time
        }
      })
      setSlots(updatedSlots)
    }
  }, [vacc])


  const handleSelect = (e) => {
    if (e.target.name === "date") {
      setSelectedDate(e.target.value)
      return
    }
    setSelectedCenter(e.target.value)
  }

  const handleInputs = (input, type) => {
    if (type === "time") {
      setOutput((prevState) => {
        return {
          ...prevState,
          time: input.time
        }
      })
      return
    }
    setVacc(input)
  }

  const handleOtherInputs = (e) => {
    setOutput((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const final = {
      centerId: vacc._id,
      ic: output.ic,
      name: output.name,
      time: output.time
    }
    if (!final.centerId || !final.ic || !final.name || !final.time) {
      setError("Please fill up all fields")
      setLoading(false)
      return
    }
    await instance.post("/bookings/user", {
      centerId: vacc._id,
      ic: output.ic,
      name: output.name,
      time: output.time
    }).then((data) => {
      if (data.data) {
        if (data.data.error) {
          setError(data.data.error)
          return
        }
        alert(`appointment booked at ${final.name} on ${new Date(final.time).toString()}`)
        setLoading(false)
        setOutput({})
        setSelectedDate("")
        setSelectedCenter("")
      }
    })
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box
          component="form"
          sx={{
            mt: 8,
          }}
        >
          <Typography component="h1" variant="h5">
            Book a slot
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nric"
            label="NRIC Number"
            name="ic"
            autoComplete="nric"
            sx={{ mb: 2 }}
            autoFocus
            onChange={(e) => { handleOtherInputs(e) }}
            value={output ? output.ic : ""}
          />
          <TextField
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            sx={{ mb: 2 }}
            onChange={(e) => { handleOtherInputs(e) }}
            value={output ? output.name : ""}
          />
          <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
          <Select
            labelId="vaccineCenterLabel"
            label="Vaccine Center"
            required
            fullWidth
            id="vaccineCenter"
            value={selectedCenter}
            onChange={handleSelect}
            name="center"
            sx={{ mb: 2 }}
          >
            {centers && centers.map((v) => {
              return <MenuItem key={v._id} value={v.name} name="center" onClick={(e) => handleInputs(v, e)}>{v.name}</MenuItem>;
            })}
          </Select>
          <InputLabel id="Date">Date</InputLabel>
          <Select labelId="Date" label="Date" required sx={{ mb: 2 }} fullWidth value={selectedDate} onChange={handleSelect} name="date">
            {slots && slots.map((item, index) => {
              const date = new Date(item.time)
              const dateStr = date.toString()
              if (item.qty < 1) {
                return
              }
              return <MenuItem key={index} value={item.time} onClick={() => { handleInputs(item, "time") }}>{dateStr}</MenuItem>
            })}
          </Select>
          <p style={{ color: "red" }}>{error && error}</p>
          <Button
            // type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            {!loading ? "Register!" : "Loading..."}
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default VaccineRegistration