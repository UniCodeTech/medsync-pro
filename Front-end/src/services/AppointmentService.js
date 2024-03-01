import axios from "axios";

const Appointment_API_BASE_URL = "http://localhost:8084/appointments";

class AppointmentService {
  createAppointment(appointment){
    return axios.post(Appointment_API_BASE_URL, appointment);
  }

  getAllAppointments(){
    return axios.get(Appointment_API_BASE_URL);
  }

  getAppointmentsByPatientId(id){
    return axios.get("http://localhost:8084/appointments/"+id);
  }

  checkMicroserviceStatus(){
    return axios.get('http://localhost:8084/appointments/status');
  }

  createGuestAppointment(guestAppointment){
    return axios.post("http://localhost:8084/guest-appointments", guestAppointment);
  }

  getGuestAppointments(){
    return axios.get("http://localhost:8084/guest-appointments");
  }
}

export default new AppointmentService();


