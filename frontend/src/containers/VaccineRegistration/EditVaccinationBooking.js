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
import DateTimePicker from "@mui/lab/DateTimePicker";
import React, { useState, useEffect } from "react";
import { instance } from "../../services/api";
import { useParams } from "react-router-dom"

const EditVaccineRegistration = () => {
  const { bookingId } = useParams()
  const [formValue, setFormValue] = useState({
    ic: "",
    name: "",
    time: 0,
    timeStr: "",
    center: "",
    centerId: "",
    oldbookingId: bookingId ? bookingId : "",
    userId: ""
  })
  const [original, setOriginal] = useState()
  const [selectedCenter, setSelectedCenter] = useState()
  const [centers, setCenters] = useState()
  const [slots, setSlots] = useState()
  const [holder, setHolder] = useState()


  useEffect(() => {
    if (selectedCenter) {

      const takenSlots = selectedCenter.bookings;
      const allSlots = selectedCenter.availableSlots;
      const takenMap = new Map()
      takenSlots.forEach((item) => {
        takenMap.has(item.timeSlot) ? takenMap.set(item.timeSlot, (takenMap.get(item.timeSlot) + 1)) : takenMap.set(item.timeSlot, 1)
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

  }, [selectedCenter])


  useEffect(() => {
    instance.get('/bookings/').then((res) => {
      setCenters(res.data)
    })
    instance.get(`/bookings/slots/one?bookingId=${bookingId}`).then((res) => {
      const data = res.data
      setFormValue((prevState) => {
        return {
          ...prevState,
          ic: data && data.patient.ic,
          name: data && data.patient.name,
          userId: data && data.patient._id,
          time: data && data.timeSlot,
          center: data && data.center.name,
          centerId: data && data.center._id,
          oldbookingId: data && data._id
        }
      })
      setOriginal(data.timeSlot)
      setSelectedCenter(data.center)
    })
  }, [])

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError("")
    const final = {
      ic: formValue.ic,
      name: formValue.name,
      time: formValue.time,
      centerId: formValue.centerId,
      oldbookingId: formValue.oldbookingId,
      userId: formValue.userId
    }
    await instance.put("/bookings/user", final).then((res) => {
      console.log(res.data)
      if (!res.data.error) {
        setSuccess(true)
        setLoading(false)
      }
      if (res.data.error) {
        setError(res.data.error)
        setLoading(false)
      }
      return
    })

  }

  const handleSelect = (key, value, formKey, formValue, obj) => {
    if (obj) {
      setSelectedCenter(obj)
    }
    setFormValue((prevState) => {
      return {
        ...prevState,
        [formKey]: formValue,
        [key]: value
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
          onSubmit={handleSubmit}
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
            value={formValue.ic}
            onChange={(e) => { setFormValue((prev) => { return { ...prev, [e.target.name]: e.target.value } }) }}
            sx={{ mb: 2 }}
            autoFocus
          />
          <TextField
            required
            fullWidth
            id="name"
            label="Full Name"
            value={formValue.name}
            onChange={(e) => { setFormValue((prev) => { return { ...prev, [e.target.name]: e.target.value } }) }}
            sx={{ mb: 2 }}
            name="name"
            autoComplete="name"
          />
          <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
          <Select
            labelId="vaccineCenterLabel"
            label="Vaccine Center"
            required
            fullWidth
            id="vaccineCenter"
            value={selectedCenter ? selectedCenter.name : ""}
            // onChange={this.handleSelect}
            sx={{ mb: 2 }}
          >
            {centers && centers.map((v) => {
              return (
                <MenuItem key={v._id} value={v.name} onClick={() => { handleSelect("centerId", v._id, "center", v.name, v) }}>
                  {v.name}
                </MenuItem>
              );
            })}
          </Select>
          <TextField
            required
            fullWidth
            id="currSlot"
            label="Full Name"
            value={new Date(original).toString()}
            sx={{ mb: 2 }}
            name="currSlot"

          />
          <InputLabel id="Date">Change Appointment Date</InputLabel>
          <Select labelId="Date" label="Date" sx={{ mb: 2 }} fullWidth value={formValue.timeStr}>
            {
              slots && slots.map((item, index) => {
                const date = new Date(item.time)
                const dateStr = date.toString()
                if (item.qty < 1) {
                  return
                }
                return <MenuItem key={index} value={dateStr} onClick={() => { handleSelect("time", item.time, "timeStr", dateStr) }}>{dateStr}</MenuItem>
              })
            }
          </Select>
          {error && (<p style={{ color: "red" }}>{error}</p>)}
          {success && (<p style={{ color: "green" }}>Booking Changed!</p>)}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {!loading ? "Register!" : "Loading..."}
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default EditVaccineRegistration

