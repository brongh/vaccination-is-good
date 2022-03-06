import React, { useState, useEffect } from 'react'

import { instance } from "../../services/api"

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

const hours = Array.from(Array(24).keys())

const CenterCreation = () => {
    const [formValue, setFormValue] = useState({
        start: 8,
        end: 20,
        name: "",
        daysForBooking: 2,
        nurse0: ""
    })
    const [success, setSuccess] = useState()
    const [loading, setLoading] = useState()
    const [error, setError] = useState()
    const [nurses, setNurses] = useState(["nurse"])

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formValue)
        const newNurses = []
        Object.keys(formValue).forEach((key) => {
            if (key.includes("nurse")) {
                newNurses.push({ name: formValue[key] })
            }
        })
        const forNewCenter = {
            name: formValue.name,
            daysForBooking: formValue.daysForBooking,
            schedule: {
                start: formValue.start,
                end: formValue.end
            }
        }
        await instance.post("/admins/center", { centerData: forNewCenter, newNurses })
    }

    const handleAddMore = (e) => {
        e.preventDefault()
        setNurses((prev) => {
            return [...prev, "nurse"]
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValue((prev) => {
            return {
                ...prev,
                [name]: value
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
                        Create a new vaccination center
                    </Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        name="name"
                        sx={{ mb: 2 }}
                        autoFocus
                        value={formValue.name}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Days in advance for booking"
                        sx={{ mb: 2 }}
                        name="daysForBooking"
                        value={formValue.daysForBooking}
                        onChange={handleChange}
                    />
                    <InputLabel id="start">Start Hour</InputLabel>
                    <Select labelId="start" required style={{ width: 100 }} value={formValue.start} onChange={handleChange}>
                        {hours.map((item, index) => {
                            return <MenuItem key={index} value={item} name="start">{item}</MenuItem>
                        })}
                    </Select>
                    <InputLabel id="end">Start Hour</InputLabel>
                    <Select labelId="end" required style={{ width: 100 }} value={formValue.end} onChange={handleChange}>
                        {hours.map((item, index) => {
                            return <MenuItem key={index} value={item} name="end">{item}</MenuItem>
                        })}
                    </Select>

                    <Typography component="h1" variant="h5" sx={{ mt: 6 }}>
                        Add Nurse
                    </Typography>
                    {nurses.map((item, index) => {
                        return (
                            <TextField margin="normal" fullWidth label="name" name={`${item}${index}`} value={formValue[`${item}${index}`]} onChange={handleChange} />
                        )
                    })}
                    <Button onClick={handleAddMore}>Add more nurses</Button>

                    {error && (<p style={{ color: "red" }}>{error}</p>)}
                    {success && (<p style={{ color: "green" }}>Booking Changed!</p>)}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 10, mb: 2 }}
                    >
                        {!loading ? "Register!" : "Loading..."}
                    </Button>
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default CenterCreation