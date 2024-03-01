import React, { useState, useEffect } from 'react';
import AppointmentService from '../../services/AppointmentService';
import DoctorService from '../../services/DoctorService';
import UserService from '../../services/UserService';

function AppointmentDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [patients, setPatients] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchQuery, appointments, doctors]);

  const loadAppointments = () => {
    // Get All Appointments
    AppointmentService.getAllAppointments()
      .then((response) => {
        setAppointments(response.data);
        loadDoctorNames(response.data);   // Set Appointments data to Doctors to get Doctor name
        loadPatientName(response.data);   // Set Appointments data to Patient to get Patient name
      })
      .catch((error) => {
        console.error('Error fetching appointments: ', error);
      });
  };

  const loadDoctorNames = (appointments) => {
    // Get Doctor name for each Appointments
    const doctorIds = appointments.map((appointment) => appointment.doctorId);
    const uniqueDoctorIds = Array.from(new Set(doctorIds)); // Remove duplicate doctorIds

    uniqueDoctorIds.forEach((doctorId) => {     // Loop
      DoctorService.findDoctorNameById(doctorId)
        .then((response) => {
          // console.log('Doctor Name: ',response.data); // Get doctor name completed
          setDoctors((prevDoctors) => ({    // get prevDoctors state and set new state
            ...prevDoctors,
            [doctorId]: response.data,
          }));
        })
        .catch((error) => {
          console.error('Error fetching doctor names: ', error);
        });
    });
    console.log(doctors);
  };

  // Get Patient names (Appointment)
  const loadPatientName = (appointments) => {
    const patientIds = appointments.map((appointment) => appointment.patientId);  // Getting patientID from appointments array
    const uniquPatientIds = Array.from(new Set(patientIds));
    uniquPatientIds.forEach((patientId) => {  // loop
      UserService.findPatientNameById(patientId).then((resp) => {   // find patient name by patient id
        setPatients((prevPatients) => ({
          ...prevPatients, [patientId]: resp.data,
        }));
      })
      .catch((err) => {
        console.error('Error fetching patient names: ',err);
      });
    });
  }

  const filterAppointments = () => {
    if (searchQuery === '') {
      setFilteredAppointments(appointments);    // all appointment
    } else {
      const filtered = appointments.filter((appointment) =>
        (appointment.appointmentNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAppointments(filtered);        // filtered appointment (by appointmentNumber)
    }
  };

  return (
    <div className="container">
      <h1>Appointment Details</h1>
      <div>
        <input
          type="text"
          className="form-control"
          placeholder="Search by Appointment Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <br/>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Appointment Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => (    // create set of element from each appointment
            <tr key={appointment.id}>
              <td>{appointment.id}</td>
              <td>{patients[appointment.patientId] || 'Loading...'}</td>
              <td>{doctors[appointment.doctorId] || 'Loading...'}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td>{appointment.description}</td>
              <td>{appointment.appointmentNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentDashboard;
