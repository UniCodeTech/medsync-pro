import axios from "axios";

const MEDICALRECORD_API_BASE_URL = "http://localhost:8083/";

class DoctorService {
  getDoctorNameById(doctorId) {
    // http://localhost:8082/doctors/1
    return axios.get(`http://localhost:8082/doctors/`+doctorId);
  }

  getAllDoctors(){
    return axios.get(`http://localhost:8082/doctors/`);
  }
  
  findDoctorNameById(id){
    //http://localhost:8082/doctors?id=1
    return axios.get('http://localhost:8082/doctors', {
        params: {
            id: id,
        }
    });
  }
  createDoctor(doctor){
    return axios.post('http://localhost:8082/doctors', doctor);
  }

  existByNic(nic){
    return axios.get('http://localhost:8082/doctors?nic='+nic);
  }

  getLastDoctorNumber(){
    return axios.get('http://localhost:8082/doctors/new');
}
}

export default new DoctorService();
