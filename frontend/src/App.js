import './App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import VaccineRegistration from './containers/VaccineRegistration/VaccineRegistration';
import VaccineRegistrationListing from './containers/VaccineRegistration/ListVaccinationBooking';
import EditVaccineRegistration from './containers/VaccineRegistration/EditVaccinationBooking';
import CenterCreation from "./containers/CenterCreation/CenterCreation"
import { NavBar } from './containers/Nav';
import { Component } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

class App extends Component {
  componentDidMount() {
    document.title = 'Vaccination Center';
  }
  render() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <NavBar />
          <Switch>
            <Route path="/centers" exact component={CenterCreation} />
            <Route path="/bookings" exact component={VaccineRegistrationListing} />
            <Route path="/bookings/:bookingId" exact component={EditVaccineRegistration} />
            <Route path="/" exact component={VaccineRegistration} />
          </Switch>
        </BrowserRouter>
      </LocalizationProvider>
    )
  }
}


export default App;
