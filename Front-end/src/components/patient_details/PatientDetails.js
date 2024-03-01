import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "./PatientDetails.css";
import UserService from '../../services/UserService';
import MedicalService from '../../services/MedicalService';
import DoctorService from '../../services/DoctorService';

class ListPatient extends Component {
    constructor(props) {
        super(props);
        const today = new Date().toISOString().split('T')[0];
        this.state = {
            searchQuery: '', 
            patient: null, // Store patient details based on the search query
            medicalRecord: null, 
            newRecord: { doctorName: '', date: '', description: '' },
            showModal: false,
            selectedDoctor: '',
            selectedDate: '',
            selectedDate: today,
            description: '',
            doctors: [],
        };
    }

    // get doctors details
    fetchDoctors = () => {
        DoctorService.getAllDoctors()
            .then(response => {
                if (response.status === 200) {
                    // Successfuled 
                    this.setState({ doctors: response.data });
                } else {
                    console.error('Error fetching doctors:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching doctors:', error);
            });
    }

    componentDidMount() {
        this.fetchDoctors();
    }

    handleAddNewRecord = () => {
        // collect all data
        const { patient, selectedDoctor, selectedDate, selectedTime, description } = this.state;

        // Create a new medical record object
        const newMedicalRecord = {
            patient_id: patient.id,
            doctor_id: selectedDoctor,
            date: selectedDate,
            description: description,
        };

        MedicalService.createMedicalRecord(newMedicalRecord) // call to the REST end point
            .then(response => {
                if (response.status === 201) {
                    this.handleSearch();
                    this.handleCloseModal();
                } else {
                    console.error('Error adding medical record:', response.data);
                    this.handleCloseModal();
                }
            })
            .catch(error => {
                console.error('Error adding medical record:', error);
            });
    }

    handleOpenModal = () => {
        this.setState({ showModal: true });
    }
    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    handleSearch = () => {
        const searchQuery = this.state.searchQuery;     // search bar text
        if (searchQuery) {
            UserService.findPatientByPatientNumber(searchQuery)    // get patients detail by NIC
                .then(response => {
                    const patient = response.data;
                    this.setState({ patient });
                    console.log('Patient ID: ', patient.id);
                    console.log(patient);

                    // get medical record for patinet
                    MedicalService.getRecordsByPatientId(patient.id)
                        .then(response => {
                            const medicalRecord = response.data;
                            this.setState({ medicalRecord });
                            console.log('Medical Record ID: ', medicalRecord);

                            // get doctor name for each medical record
                            medicalRecord.forEach(record => {
                                DoctorService.getDoctorNameById(record.doctor_id)
                                    .then(doctorResponse => {
                                        if (doctorResponse.status === 200) {
                                            record.doctorName = doctorResponse.data.name;
                                            this.forceUpdate();
                                        } else {
                                            console.error('Error fetching doctor details:', doctorResponse.data);
                                        }
                                    })
                                    .catch(doctorError => {
                                        console.error('Error fetching doctor details:', doctorError);
                                    });
                            });
                        })
                        .catch(err => {
                            console.error('Error getting medical records: ', err);
                            //window.location.reload();
                        });
                })
                .catch(error => {
                    console.error("Error searching patient by ID:", error);
                    //window.location.reload();
                });
        } else {
            console.error("Search ID");
            //window.location.reload();
        }
    }

    render() {
        return (
            <div>
                <Button variant="secondary" size="sm" className="float-left" onClick={() => window.history.back()}>
                    Go Back
                </Button>
                <div className="search">
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search by Patient NIC..."
                        value={this.state.searchQuery}
                        onChange={(e) => this.setState({ searchQuery: e.target.value })}
                    />
                    <button id="searchButton" onClick={this.handleSearch}>Search</button>
                </div>

                {/* Patient details tabel */}
                {this.state.patient && (
                    <div className='patient-details'>
                        <h2>Patient Details:</h2>
                        <table className='table table-striped table-bordered'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>NIC</th>
                                    <th>Age</th>
                                    <th>Address</th>
                                    <th>Phone Number</th>
                                    <th>Gender</th>
                                    <th>Blood Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{this.state.patient.id}</td>
                                    <td>{this.state.patient.firstName}</td>
                                    <td>{this.state.patient.lastName}</td>
                                    <td>{this.state.patient.nic}</td>
                                    <td>{this.state.patient.age}</td>
                                    <td>{this.state.patient.address}</td>
                                    <td>{this.state.patient.contactNumber}</td>
                                    <td>{this.state.patient.gender}</td>
                                    <td>{this.state.patient.bloodGroup}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Medical record table */}
                {this.state.medicalRecord && (
                <div className='medical-history'>
                    <h2>Medical History:</h2>
                    <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Doctor Name</th>
                        <th>Date</th>
                        <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.medicalRecord.map((record) => (
                        <tr key={record.id}>
                            <td>{record.id}</td>
                            <td>{record.doctorName}</td>
                            <td>{record.date}</td>
                            <td>{record.description}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>

                    {/* Open add new medical hostory pop up */}
                    <Button variant="primary" onClick={this.handleOpenModal}>   
                        Add New Medical History
                    </Button>
                </div>
                )}
                
                {/* Add new medical history pop up */}
                <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Medical History</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Doctor</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={this.state.selectedDoctor}
                                    onChange={(e) => this.setState({ selectedDoctor: e.target.value })}
                                >
                                    <option value="">Select Doctor</option>
                                    {/* Get doctor names */}
                                    {this.state.doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.name}
                                        </option>
                                    ))} 
                                </Form.Control> 
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={this.state.selectedDate}
                                    onChange={(e) => this.setState({ selectedDate: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={this.state.description}
                                    onChange={(e) => this.setState({ description: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleAddNewRecord}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default ListPatient;
