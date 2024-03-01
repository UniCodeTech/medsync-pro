import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import managePatientsImage from '../../assets/manage-patient.jpg';
import doctorsDashboardImage from '../../assets/doctor-dashboard.jpg';
import patientRecordsImage from '../../assets/patient-records.jpg';

class Homepage extends Component {
  state = {};

  render() {
    return (
      <div className="container text-center mt-5">
        <h2>Welcome To MedSync Pro</h2>
        <p className="lead mt-3">
          MedSync Pro is your all-in-one healthcare management solution. We are
          dedicated to providing you with the best healthcare experience.
        </p>

        <div className="row mt-5">
          <div className="col-md-4">
            <div className="feature">
              <img
                src={managePatientsImage}
                alt="Manage Patients"
                className="feature-image"
                style={{ width: '350px', height: '240px' }}
              />
              <h3 className="feature-title">Manage Patients</h3>
              <p className="feature-description">
                Easily manage your patients' information and appointments.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature">
              <img
                src={doctorsDashboardImage}
                alt="Doctor's Dashboard"
                className="feature-image"
                style={{ width: '350px', height: '240px' }}
              />
              <h3 className="feature-title">Doctor's Dashboard</h3>
              <p className="feature-description">
                Access your dashboard to view appointments, medical records, and more.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature">
              <img
                src={patientRecordsImage}
                alt="Patient Records"
                className="feature-image"
                style={{ width: '350px', height: '240px' }}
              />
              <h3 className="feature-title">Patient Records</h3>
              <p className="feature-description">
                Maintain and organize patient records with ease.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link to="/login">
            <button className="btn btn-primary btn-lg m-5">
              <i className="fas fa-sign-in-alt"></i> Login
            </button>
          </Link>
          <Link to="/create-appointment">
            <a className="btn btn-secondary btn-lg m-5">
              <i className="fas fa-sign-in-alt"></i> Appointment
            </a>
          </Link>


          {/* <Link to="/add-patients">
            <button className="btn btn-success btn-lg m-5">
              <i className="fas fa-user-plus"></i> Sign Up
            </button>
          </Link> */}
        </div>
      </div>
    );
  }
}

export default Homepage;
