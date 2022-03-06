import { Link } from 'react-router-dom';
import React from "react";
import Tabs from "@mui/material/Tabs";
import LinkTab from "@mui/material/Tab";

export const NavBar = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Tabs value={value} onChange={handleChange} centered>
      <LinkTab component={Link} to="/" label="Make a Booking" />
      <LinkTab component={Link} to="/bookings" label="All Booking" />
      <LinkTab component={Link} to="/centers" label="New Centers" />
    </Tabs>
  );
};