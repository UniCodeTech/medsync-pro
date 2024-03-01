import React, { Component } from 'react';
import doctorImage from '../../assets/medical-image1.jpeg';
import './HomePage.css';

class DoctorDashboard extends Component {
  render() {
    return (
      <div className="container">
        <div className="homepage-container">
          <div className="right-section">
            <div className="jumbotron">
              <h1>Welcome, Doctor!</h1>
              <p>Manage your patients and appointments here.</p>
            </div>
            <div className="card">
              <img
                src={doctorImage}
                alt="Doctor Image"
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">Actions</h5>
                <a href="/add-patients" className="btn btn-primary m-2">
                  Register Patients
                </a>
                <a href="/patient-details" className="btn btn-success m-2">
                  Patient Details
                </a>
                <a href="/appointment-dashboard" className="btn btn-info m-2">
                  Appointment Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DoctorDashboard;
