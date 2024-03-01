import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router";
import Navbar from './components/shared/Navbar';
import DoctorDashboard from './components/homepage/DoctorDashboard';
import Login from './components/login/Login';
import PatientDashboard from './components/patient_dashbord/PatientDashboard';
import ListPatient from './components/patient_details/PatientDetails';
import Register from './components/register/Register';
import Home from './components/homepage/Homepage';
import AppointmentDashboard from './components/appointment/AppointmentDashboard';
import AdminDashboard from './components/admin_dashboard/AdminDashboard';
import AppointmentForm from './components/appointment/CreateAppointment';
import Footer from './components/shared/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='container'>
        <Routes>
          <Route path="/" exact Component={Home}  ></Route>
          <Route path="/doctor-dashboard" exact Component={DoctorDashboard}  ></Route>
          <Route path="/login" Component={Login}  ></Route>
          <Route path="/patient-dashboard/:patientNumber" element={<PatientDashboard />} />
          <Route path='/add-patients' Component={Register}></Route>
          <Route path="/patient-details" Component={ListPatient}  ></Route>
          <Route path="/appointment-dashboard" Component={AppointmentDashboard}  ></Route>
          <Route path="/admin" Component={AdminDashboard}  ></Route>
          <Route path="/create-appointment" Component={AppointmentForm} />

          <Route path="*" element={<div>Page Not Found</div>}></Route>
        </Routes>
      </div>
      <footer>
        <Footer/>
      </footer>
    </Router>
  );
}

export default App;
