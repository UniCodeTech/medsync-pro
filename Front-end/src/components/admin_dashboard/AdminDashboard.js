import React, { Component } from 'react';
import DoctorService from '../../services/DoctorService';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import UserService from '../../services/UserService';
import MedicalService from '../../services/MedicalService';
import AppointmentService from '../../services/AppointmentService';

class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggleCreateDoctorPopup = this.toggleCreateDoctorPopup.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleCreateDoctor = this.handleCreateDoctor.bind(this);
    }
    
    state = {
        appointmentDetails: [],
        guestAppointmentDetails: [], // Add this line
        doctors: {},
        patient: {},
        isCreateDoctorPopupOpen: false,
        showModal: false,
        userMicroserviceStatus: 'Wait..',
        appointmentMicroserviceStatus: 'Wait..',
        medicalRecordMicroserviceStatus: 'Wait..',
        newDoctor: {
            name: '',
            nic: '',
            spec: '',
            doctorNumber: 0
        },
        validationMessages: {},
        showModal: false,
        allPatients: []
    };

    componentDidMount() {
        this.getAllPatients();
        this.getGuestAppointments();
        this.getAllAppointments();
        this.getLastPatientNumber();
        this.checkMicroservicesStatus();
        this.intervalId = setInterval(this.checkMicroservicesStatus, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    getGuestAppointments = () => {
        // Fetch guest appointments and set them in the state
        AppointmentService.getGuestAppointments().then((res) => {
            this.setState({ guestAppointmentDetails: res.data });
        });

        // Fetch regular appointments and set them in the state
        AppointmentService.getAllAppointments().then((res) => {
            this.loadDoctorNames(res.data);
            this.loadPatientNames(res.data);
            this.setState({ appointmentDetails: res.data });
        });
    }

    getLastPatientNumber = () => {
        DoctorService.getLastDoctorNumber().then((r) => {
            this.setState({
                newDoctor: {
                    ...this.state.newDoctor,
                    doctorNumber: r.data,
            },
            });
        });
      };

    checkMicroservicesStatus = () => {
        UserService.checkMicroserviceStatus()
            .then(response => {
                console.log('Microservice Status: Online');
                this.setState({ userMicroserviceStatus: 'Online', userMicroserviceColor: 'green' });
            })
            .catch(error => {
                if (error.response) {
                    console.log('Microservice Status: Error - Server responded with status code');
                    this.setState({ userMicroserviceStatus: 'Error' , userMicroserviceColor: 'red' });
                } else if (error.request) {
                    console.log('Microservice Status: Offline - No response received');
                    this.setState({ userMicroserviceStatus: 'Offline', userMicroserviceColor: 'red' });
                } else {
                    console.log('Microservice Status: Error - Request setup error');
                    this.setState({ userMicroserviceStatus: 'Offline' , userMicroserviceColor: 'red' });
                }
            });

            MedicalService.checkMicroserviceStatus()
            .then(response => {
                console.log('Microservice Status: Online');
                this.setState({ medicalRecordMicroserviceStatus: 'Online', medicalRecordMicroserviceColor: 'green' });
            })
            .catch(error => {
                if (error.response) {
                    console.log('Microservice Status: Error - Server responded with status code');
                    this.setState({ medicalRecordMicroserviceStatus: 'Error' , medicalRecordMicroserviceColor: 'red' });
                } else if (error.request) {
                    console.log('Microservice Status: Offline - No response received');
                    this.setState({ medicalRecordMicroserviceStatus: 'Offline', medicalRecordMicroserviceColor: 'red' });
                } else {
                    console.log('Microservice Status: Error - Request setup error');
                    this.setState({ medicalRecordMicroserviceStatus: 'Offline' , medicalRecordMicroserviceColor: 'red' });
                }
            });

            AppointmentService.checkMicroserviceStatus()
            .then(response => {
                console.log('Microservice Status: Online');
                this.setState({ appointmentMicroserviceStatus: 'Online', appointmentMicroserviceColor: 'green' });
            })
            .catch(error => {
                if (error.response) {
                    console.log('Microservice Status: Error - Server responded with status code');
                    this.setState({ appointmentMicroserviceStatus: 'Error' , appointmentMicroserviceColor: 'red' });
                } else if (error.request) {
                    console.log('Microservice Status: Offline - No response received');
                    this.setState({ appointmentMicroserviceStatus: 'Offline', appointmentMicroserviceColor: 'red' });
                } else {
                    console.log('Microservice Status: Error - Request setup error');
                    this.setState({ appointmentMicroserviceStatus: 'Offline' , appointmentMicroserviceColor: 'red' });
                }
            });
    };

    handleInputChange(event) {
        const { name, value } = event.target;
        this.setState(prevState => ({
            newDoctor: {
                ...prevState.newDoctor,
                [name]: value
            }
        }));
    }

    toggleCreateDoctorPopup() {
        this.setState({ showModal: true });
    }

    handleCloseModal = () => { 
        this.setState({ showModal: false });
    }

    handleCreateDoctor() {
        // Perform validation
        const { name, nic, spec } = this.state.newDoctor;
        const validationMessages = {};

        if (!name) {
            validationMessages.name = 'Name is required';
        }

        if (!nic) {
            validationMessages.nic = 'NIC is required';
        }

        if (!spec) {
            validationMessages.spec = 'Specialization is required';
        }

        if (Object.keys(validationMessages).length > 0) {
            this.setState({ validationMessages });
            return;
        }

        // Check if NIC exists
        DoctorService.existByNic(nic).then((res) => {
            if (res.data === false) {
                // NIC is unique
                console.log('NIC is unique, proceed to create the doctor');
                DoctorService.createDoctor({
                    name: this.state.newDoctor.name,
                    nic: this.state.newDoctor.nic,
                    spec: this.state.newDoctor.spec,
                    doctorNumber: this.state.newDoctor.doctorNumber
                }).then(response => {
                    if (response.status === 200) {
                        // New doctor created
                        console.log('New doctor created successfully');
                        this.handleCloseModal();
                        this.setState({
                            validationMessages: {}
                        });
                    } else {
                        validationMessages.spec = 'Error';
                    }
                });
            } else {
                // NIC already exists
                validationMessages.nic = 'NIC is already in use';
                this.setState({ validationMessages });
            }
        });
    }

    getAllAppointments = () => {
        AppointmentService.getAllAppointments()
          .then((res) => {
            this.loadDoctorNames(res.data);
            this.loadPatientNames(res.data);
            const appointments = res.data;
            this.setState({ appointmentDetails: appointments });
          });
      }
      

    loadDoctorNames = (appointments) => {
        // Get and set doctor names for each appointment.
        const doctorIds = appointments.map((appointment) => appointment.doctorId);
        const uniqueDoctorIds = Array.from(new Set(doctorIds));
        console.log('loadDoctorNames: ',uniqueDoctorIds);
        uniqueDoctorIds.forEach((doctorId) => {
          DoctorService.findDoctorNameById(doctorId)
            .then((response) => {
              this.setState((prevState) => ({
                doctors: {
                  ...prevState.doctors,
                  [doctorId]: response.data,
                },
              }));
            })
            .catch((error) => {
              console.error('Error fetching doctor names: ', error);
            });
        });
      };
    loadPatientNames = (appointments) => {
        const patientIds = appointments.map((appointment) => appointment.patientId);
        const uniquePatientIds = Array.from(new Set(patientIds));
        uniquePatientIds.forEach((patientId) =>{
            UserService.findPatientNameById(patientId).then((response) => {
                this.setState((prevState) => ({
                    patient: {
                        ...prevState.patient,
                        [patientId]: response.data
                    },
                }));
            })
            .catch((error) => {
                console.error('Error fetching patient names: ', error);
              });
        });
    }

    getAllPatients = () => {
        UserService.getUsers()
            .then((res) => {
                console.log('Patients: ',res.data);
                this.setState({ allPatients: res.data });
            })
            .catch((error) => {
                console.error('Error fetching patients: ', error);
            });
    }
    

    render() {
        const { appointmentDetails } = this.state;
        return (
            <div className="admin-dashboard">
                <br/>
                <h1 className="display-4">Receptionist Dashboard</h1>
                <br/><br/>
                <button
                    className="btn btn-primary"
                    onClick={() => this.toggleCreateDoctorPopup()}
                >
                    Create New Doctor
                </button>
                <Link to="/add-patients">
                    <button className="btn btn-success m-5">
                    <i className="fas fa-user-plus"></i> Register Patient
                    </button>
                </Link>
                <div className='row'>
                    <h2 className="mt-4">Patients</h2>
                    <div className="table-container" style={{ maxHeight: "400px", overflowY: "scroll" }}>
                        <table className='table table-striped table-bordered'>
                            <thead style={{ position: "sticky", top: "0", backgroundColor: "white", zIndex: "1" }}>
                                <tr>
                                    <th>Patient Number</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>NIC</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Address</th>
                                    <th>Phone Number</th>
                                    <th>Blood Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.allPatients.map(patient =>
                                    <tr key={patient.patientId}>
                                        <td>{patient.patientNumber}</td>
                                        <td>{patient.firstName}</td>
                                        <td>{patient.lastName}</td>
                                        <td>{patient.nic}</td>
                                        <td>{patient.gender}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.address}</td>
                                        <td>{patient.contactNumber}</td>
                                        <td>{patient.bloodGroup}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div>
                    <div>
                        <h2 className="mt-4">Appointment</h2>
                        {appointmentDetails && appointmentDetails.length > 0 && (
                        <div className="table-container" style={{ overflowY: 'auto', maxHeight: '400px' }}>
                            <table className="table table-striped table-bordered">
                            <thead style={{ position: "sticky", top: "0", backgroundColor: "white", zIndex: "1" }}>
                                <tr>
                                <th>ID</th>
                                <th>Patient Name</th>
                                <th>Doctor Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Appointment Number</th>
                                <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointmentDetails.map((record, index) => (
                                <tr key={index}>
                                    <td>{record.id}</td>
                                    <td>{this.state.patient[record.patientId]}</td>
                                    <td>{this.state.doctors[record.doctorId]}</td>
                                    <td>{record.date}</td>
                                    <td>{record.time}</td>
                                    <td>{record.appointmentNumber}</td>
                                    <td>{record.description}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                        )}
                    </div>
                    <br/><br/>
                    <div>
                        <h2 className="mt-4">Guest Patient Appointments</h2>
                        {this.state.guestAppointmentDetails && this.state.guestAppointmentDetails.length > 0 && (
                             <div className="table-container" style={{ maxHeight: "400px", overflowY: "scroll" }}>
                            <table className="table table-striped table-bordered">
                                <thead style={{ position: "sticky", top: "0", backgroundColor: "white", zIndex: "1" }}>
                                <tr>
                                    <th>ID</th>
                                    <th>Guest Patient Name</th>
                                    <th>Doctor Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Appointment Number</th>
                                    <th>Description</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.guestAppointmentDetails.map(appointment =>
                                    <tr key={appointment.id}>
                                    <td>{appointment.id}</td>
                                    <td>{appointment.guestName}</td>
                                    <td>{appointment.doctorName}</td>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.appointmentNumber}</td>
                                    <td>{appointment.description}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            </div>
                        )}
                        </div>
                        <br/><br/>
                <h2>Microservices Status</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Microservice</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>User Service</td>
                                <td style={{ color: this.state.userMicroserviceColor }}>{this.state.userMicroserviceStatus}</td>
                            </tr>
                            <tr>
                                <td>Appointment Service</td>
                                <td style={{ color: this.state.appointmentMicroserviceColor }}>{this.state.appointmentMicroserviceStatus}</td>
                            </tr>
                            <tr>
                                <td>Medical Record Service</td>
                                <td style={{ color: this.state.medicalRecordMicroserviceColor }}>{this.state.medicalRecordMicroserviceStatus}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Doctor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Add your form fields here */}
                        <label htmlFor="name">Doctor Number:</label>
                        <input
                            type="text"
                            name="doctorNumber"
                            readOnly="true"
                            value={this.state.newDoctor.doctorNumber}
                            onChange={e => this.handleInputChange(e)}
                            className="form-control"
                        />
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={this.state.newDoctor.name}
                            onChange={e => this.handleInputChange(e)}
                            className="form-control"
                        />
                        {this.state.validationMessages.name && (
                            <div className="alert alert-danger">
                                {this.state.validationMessages.name}
                            </div>
                        )}

                        <label htmlFor="nic">NIC:</label>
                        <input
                            type="text"
                            name="nic"
                            value={this.state.newDoctor.nic}
                            onChange={e => this.handleInputChange(e)}
                            className="form-control"
                        />
                        {this.state.validationMessages.nic && 
                            <div className="alert alert-danger">
                                {this.state.validationMessages.nic}
                            </div>
                        }

                        <label htmlFor="spec">Specialization:</label>
                        <select
                            name="spec"
                            value={this.state.newDoctor.spec}
                            onChange={e => this.handleInputChange(e)}
                            className="form-control"
                        >
                            <option value="">Select specialization</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatrician">Pediatrician</option>
                        </select>
                        {this.state.validationMessages.spec && 
                            <div className="alert alert-danger">
                                {this.state.validationMessages.spec}
                            </div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleCreateDoctor}>
                            Create
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default AdminDashboard;