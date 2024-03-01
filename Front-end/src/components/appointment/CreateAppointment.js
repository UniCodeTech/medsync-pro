import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import DoctorService from '../../services/DoctorService';
import AppointmentService from '../../services/AppointmentService';

function AppointmentForm(props) {
    // select date
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const [formData, setFormData] = useState({
        guestName: '',
        doctorName: '',
        date: formatDate(new Date()),
        time: '',
        description: '',
    });

    const [doctorNames, setDoctorNames] = useState([]);

    // Calculate the One week
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const SaveAppointment = (e) => {
      e.preventDefault();
      const appointmentNumber = generateUniqueAppointmentID(
          99,
          formData.date,
          formData.time,
      );
        console.log('Guest Name: ',formData.guestName);
      const appointment = {
          guestName: formData.guestName,
          doctorName: formData.doctorName,
          date: formData.date,
          time: formData.time,
          description: formData.description,
          appointmentNumber: appointmentNumber,
      };
      console.log('Appointment: ',appointment);
      AppointmentService.createGuestAppointment(appointment)
        .then((response) => {
          console.log("Appointment created successfully:", response);
        })
        .catch((error) => {
          console.error("Error creating appointment:", error);
        });
  };

    useEffect(() => {
        DoctorService.getAllDoctors()
            .then((ress) => {
                setDoctorNames(ress.data);
            })
            .catch((error) => {
                console.error('Error fetching doctor names:', error);
            });
    }, []);

    return (
        <div>
            <br />
            <div className="title">
                <h2>Appointment</h2>
            </div>
            <form>
                <div className="form-group">
                    <label htmlFor="guestName">Patient Name:</label>
                    <input
                      type="text"
                      id="guestName"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleChange}
                      className="form-control"
                  />

                </div>
                <div className="form-group">
                    <label htmlFor="doctorName">Doctor Name:</label>
                    <select
                        id="doctorName"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={(e) =>
                          setFormData({ ...formData, doctorName: e.target.value })
                        }
                        className="form-control"
                    >
                        <option value="">Select a doctor</option>
                        {doctorNames.map((doctor, index) => (
                            <option key={index} value={`${doctor.name} - ${doctor.spec}`}>
                                {doctor.name} - {doctor.spec}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <Form.Control
                        type="date"
                        placeholder="Enter date"
                        value={formData.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                        min={formatDate(today)}
                        max={formatDate(nextWeek)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="time">Time:</label>
                    <Form.Control
                      as="select"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })}
                    >
                      <option value="">Select a Time Slot</option>
                      <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                      <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                    </Form.Control>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="form-control"
                    />
                </div>
                <div className="button-group">
                    <br />
                    <button className="btn btn-primary m-5" onClick={SaveAppointment}>Save</button>
                    <button className="btn btn-secondary m-5" onClick={() => window.history.back()}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default AppointmentForm;
