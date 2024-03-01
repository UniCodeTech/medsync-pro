import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
import UserService from '../../services/UserService';
import MedicalService from '../../services/MedicalService';
import DoctorService from '../../services/DoctorService';
import AppointmentService from '../../services/AppointmentService';

function PatientDashboard() {
  const { patientNumber } = useParams();
  const [id, setId] = useState(null);
  // const [patientDetails, setPatientDetails] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showEditModal, setShowEditmentModal] = useState(false);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorsName, setDoctorsName] = useState({});
  const [appointmentData, setAppointmentData] = useState({
    name: '',
    date: '',
    time: '',
    description: '',
    doctorId: '',
  });
  const [patientDetails, setPatientDetails] = useState({
    firstName: '',
    lastName: '',
    nic: '',
    address: '',
    contactNumber: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    bloodGroup: '',
  });
  
  const [updateUser, setUpdateDetails] = useState({
    firstName: '',
    lastName: '',
    nic: '',
    address: '',
    contactNumber: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    bloodGroup: ''
  });

  const handleCloseAppointmentModal = () => {
    window.location.reload();
    setShowAppointmentModal(false)
  };

  const handleCloseEditModal = () => setShowEditmentModal(false);

  const handleShowAppointmentModal = () => {
    getDoctorsList();   // get all doctors list when Appointment modal opend
    setShowAppointmentModal(true);
  };

  const handleShowEditModal = () => { // open update modal
    UserService.findPatientByID(id)   // find patient by id
    .then((r) => {
      console.log(r.status);
      if(r.status === 200) {
        setUpdateDetails(r.data);
        console.log(updateUser);
      } else{
        console.error('Error fetching patient details: ',r.data);
        setError(r.data);
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    })
    .catch((error) => {
      console.error('Error fetching patient details:', error);
    });
    setShowEditmentModal(true);
  }

  const getDoctorsList = () => {
    DoctorService.getAllDoctors()     // get all doctors
    .then((response) => {
      if (response.status === 200) {
        setDoctors(response.data);
      } else {
        console.error('Error fetching doctors:', response.data);
      }
    })
    .catch((error) => {
      console.error('Error fetching doctors:', error);
    });
  };

  const handleDoctorSelect = (doctor) => {    // drop down menu
    setSelectedDoctor(doctor);
    setAppointmentData({ ...appointmentData, doctorId: doctor.id });
  };
  

  const handleSaveAppointment = () => {   // save an Appointment
    // generate appointment number
    const appointmentNumber = generateUniqueAppointmentID(
      patientDetails.id,
      appointmentData.date,
      appointmentData.time
    );

    const appointment = {
      patientId: patientDetails.id,
      doctorId: appointmentData.doctorId,
      date: appointmentData.date,
      time: appointmentData.time,
      description: appointmentData.description,
      appointmentNumber,
    };

    console.log(appointment);
 
    AppointmentService.createAppointment(appointment) // call REST end point
      .then((res) => {
        handleCloseAppointmentModal();
        console.log('Appointment Created');
      })
      .catch((error) => {
        console.error('Error creating appointment: ', error);
      });
  };

  function generateUniqueAppointmentID(patientId, date, timeSlot) {   // 110242
    const [year, month, day] = date.split('-');
    const formattedDate = `${month}-${day}`;
  
    let session = 0;
  
    if (timeSlot === '4:00 PM - 6:00 PM') {
      session = 1;
    } else if (timeSlot === '6:00 PM - 8:00 PM') {
      session = 2;
    }
  
    return `${patientId}${formattedDate}${session}`;
  }
  

  const handleSaveUser = () => {
    console.log('handleSaveUser excecute');
    UserService.updatePatient(updateUser, id)   // Update patient edn point
    .then((response) => { 
      console.log('Response Status: ', response.status);
      if (response.status === 200) {
        console.log('Patient updated successfully:', response.data);
        window.location.reload();
        handleCloseEditModal();
      } else {
        console.error('Error updating patient:', response.data);
        setError('Error updating patient');

        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    })
    .catch((error) => {
      console.error('API request failed:', error);
    });
  };

  // Calculate the One week for select appointment date
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
 
  useEffect(() => { 
    fetchAppointments();    // call fetchAppointments function when component is first loaded
  }, []);
  

  const fetchAppointments = () => {
    AppointmentService.getAppointmentsByPatientId(id)
    .then((response) => {
      if (response.status === 200) {
        loadDoctorNames(response.data);
        const currentDate = new Date();
        console.log('Appointments Data'); 

        // only show future appointments
        const futureAppointments = response.data.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= currentDate;
        });

        setAppointments(futureAppointments);
      } else {
        console.error('Error fetching appointments:', response.data);
      } 
    })
    .catch((error) => {
      console.error('Error fetching appointments:', error);
    });
  };

  const loadDoctorNames = (appointments) => {
    // Get and set doctor names for each appointment.
    const doctorIds = appointments.map((appointment) => appointment.doctorId);
    const uniqueDoctorIds = Array.from(new Set(doctorIds));

    uniqueDoctorIds.forEach((doctorId) => {
      DoctorService.findDoctorNameById(doctorId)
        .then((response) => {
          // console.log('Doctor Name: ',response.data); // getting doctor name completed
          setDoctorsName((prevDoctors) => ({
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
  
  
  
  // set patient details when component is loaded (Automatically)
  useEffect(() => {
    console.log('Patient Number: ',patientNumber);
    UserService.findPatientByPatientNumber(patientNumber)
      .then((response) => {
        if (response.status === 200) { 
          setId(response.data.id);
          setPatientDetails(response.data);
          setUpdateDetails(response.data);
          
          // get patient medical record
          console.log('getRecordsByPatientId:' ,response.data.id);
          MedicalService.getRecordsByPatientId(response.data.id)
          .then(async (medicalRecordsResponse) => {
            if (medicalRecordsResponse.status === 200) {
              const records = medicalRecordsResponse.data;

              // get doctor name for each medical record
              const fetchDoctorName = async (record) => {
                const doctorResponse = await DoctorService.getDoctorNameById(record.doctor_id);
                if (doctorResponse.status === 200) {
                  record.doctorName = doctorResponse.data.name;
                }
              };

              // Fetch the doctor's name for each record
              await Promise.all(records.map(fetchDoctorName));

              setMedicalHistory(records);
            } else {
              console.error('Error fetching medical records:', medicalRecordsResponse.data);
            }
          })
          .catch((medicalRecordsError) => {
            console.error('Error fetching medical records:', medicalRecordsError);
          });

        } else {
          console.error('Error fetching patient details:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching patient details:', error);
      });
    getDoctorsList();
    fetchAppointments();
  }, [patientDetails.nic]);

  return (
    <div>
      <div>
        <h1 className="mt-4">Welcome to the Dashboard</h1>
        
        <br/>
        <div className="d-flex justify-content-between">
          <h2>Patient Details</h2>
          <div>
            <button className="btn btn-primary mx-1" onClick={handleShowAppointmentModal}>
              Appointment
            </button>
          </div>
        </div>


        {/* Patient Details         */}
        {patientDetails && (
          <div className="bg-light p-3">
            <p><strong>First Name:</strong> {patientDetails.firstName}</p>
            <p><strong>Last Name:</strong> {patientDetails.lastName}</p>
            <p><strong>NIC Number:</strong> {patientDetails.nic}</p>
            <p><strong>Address:</strong> {patientDetails.address}</p>
            <p><strong>Contact Number:</strong> {patientDetails.contactNumber}</p>
            <p><strong>Date Of Birth:</strong> {patientDetails.dateOfBirth}</p>
            <p><strong>Age:</strong> {patientDetails.age}</p>
            <p><strong>Gender:</strong> {patientDetails.gender}</p>
            <p><strong>Blood Type:</strong> {patientDetails.bloodGroup}</p>
            <button className="btn btn-primary" onClick={handleShowEditModal}>
              Edit Details
            </button>
          </div>
        )}
      </div>
      
      {/* Medical Details */}
      <div>
        <h2 className="mt-4">Medical History</h2>
        {medicalHistory && medicalHistory.length > 0 && (
          <div className="bg-light p-3">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Doctor Name</th>
                  <th>Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {medicalHistory.map((record, index) => (
                  <tr key={index}>
                    <td>{record.id}</td>
                    <td>{record.doctorName}</td>
                    <td>{record.date}</td>
                    <td>{record.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment table */}
      <div>
        <h2 className="mt-4">Scheduled Appointments</h2>
        {appointments && appointments.length > 0 && (
          <div className="bg-light p-3">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Doctor Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => ( 
                  <tr key={index}>
                    <td>{appointment.appointmentNumber}</td>
                    <td>{doctorsName[appointment.doctorId] || 'Loading...'}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {/* Appointment Form Modal */}
      <Modal show={showAppointmentModal} onHide={handleCloseAppointmentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group controlId="formBasicFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={patientDetails.firstName}
            
          />
        </Form.Group>
        <Form.Group controlId="formBasicLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={patientDetails.lastName}
            onChange={(e) =>
              setAppointmentData({ ...appointmentData, name: patientDetails.firstName + ' ' + e.target.value })
            }
          />

        </Form.Group>
            <Form.Group controlId="formBasicDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter date"
                value={appointmentData.date}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, date: e.target.value })
                }
                min={formatDate(today)}
                max={formatDate(nextWeek)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                as="select"
                value={appointmentData.time}
                onChange={(e) =>
                  setAppointmentData({ ...appointmentData, time: e.target.value })
                }
              >
                <option value="">Select a Time Slot</option>
                <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicDoctor">
              <Form.Label>Doctor</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-doctor">
                  {selectedDoctor ? selectedDoctor.name : 'Select a doctor'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item key="0" onClick={() => handleDoctorSelect(null)}>
                  - Select Doctor -
                </Dropdown.Item>
                  {doctors.map((doctor) => (
                    <Dropdown.Item
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      {doctor.name} - {doctor.spec}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Form.Group controlId="formBasicDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={appointmentData.description}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAppointmentModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveAppointment}>
            Save Appointment
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Update Form Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

          <Form>
            <Form.Group controlId="formBasicFname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={updateUser.firstName}
                onChange={(e) => {
                  setUpdateDetails({ ...updateUser, firstName: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicLname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={updateUser.lastName}
                onChange={(e) => {
                  setUpdateDetails({ ...updateUser, lastName: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicNIC">
              <Form.Label>NIC Number</Form.Label>
              <Form.Control
                type="text"
                value={updateUser.nic}
                onChange={(e) => {
                  setUpdateDetails({ ...updateUser, nic: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={updateUser.address}
                onChange={(e) => {
                  setUpdateDetails({ ...updateUser, address: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicTp">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                value={updateUser.contactNumber}
                onChange={(e) => {
                  setUpdateDetails({ ...updateUser, contactNumber: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicDob">
              <Form.Label>Date Of Birth</Form.Label>
              <Form.Control
                type="date"
                value={updateUser.dateOfBirth}
                onChange={(e) => {
                  setUpdateDetails({ ...updateUser, dateOfBirth: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="text"
                value={updateUser.age}
                onChange={(e) => {
                  setUpdateDetails({ ...updateUser, age: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                value={updateUser.gender}
                onChange={(e) => {
                  setUpdateDetails({ ...updateUser, gender: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicBlood">
              <Form.Label>Blood Type</Form.Label>
              <Form.Control
                type="text"
                value={updateUser.bloodGroup}
                onChange={(e) => {
                  setUpdateDetails({ ...updateUser, bloodGroup: e.target.value });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      
    </div>
  );
}

export default PatientDashboard;