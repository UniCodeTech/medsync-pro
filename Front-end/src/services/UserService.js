import axios from "axios";

const STUDENT_API_BASE_URL = "http://localhost:8082/patients";

class UserService{

    getUsers(){
        return axios.get(STUDENT_API_BASE_URL);
    }

    findPatientByID(id) {
        return axios.get("http://localhost:8082/patients/"+id);
        // http://localhost:8082/patients/1
    } 

    findPatientByNic(nic) {
        return axios.get("http://localhost:8082/patients/nic/"+nic);
    } 

    findPatientByPatientNumber(patientNumber) {
        return axios.get("http://localhost:8082/patients/patient-number/"+patientNumber);
    }

    updatePatient(updateUser, id){
        return axios.put(`http://localhost:8082/patients`, updateUser);
    }
    
    updateUser(user,id) {
        return axios.put("http://localhost:8082/users/" + id, user);
    }

    getPatient(){
        return axios.get(STUDENT_API_BASE_URL);
    }

    createPatient(patient){
        return axios.post(STUDENT_API_BASE_URL, patient);
    }

    getPatientById(patientId){
        return axios.get(STUDENT_API_BASE_URL + '/' + patientId);
    }

    getPatientByNIC(patientNIC){
        return axios.get(`http://localhost:8082/patients/nic/${patientNIC}`);
    }


    login(patientNumber) {
        return axios.get("http://localhost:8082" + '/users', {
          params: {
            patientNumber: patientNumber,
          }
        });
    }

    checkNicAvailability(nic) {
        return axios.get(`http://localhost:8082/patients/nic/${nic}`);
      }
      
    existsByNic(nic){
        return axios.get('http://localhost:8082/patients?nic='+nic);
    }

    findPatientNameById(id){
        return axios.get('http://localhost:8082/patients', {
            params: {
                id: id,
            }
        });
    }

    checkMicroserviceStatus(){
        return axios.get('http://localhost:8082/patients/status');
    }

    getLastPatientNumber(){
        return axios.get('http://localhost:8082/patients/new');
    }
    
}

export default new UserService()