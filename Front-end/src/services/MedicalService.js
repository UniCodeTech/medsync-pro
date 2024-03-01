import axios from "axios";

const MEDICALRECORD_API_BASE_URL = "http://localhost:8083/";

class MedicalService {
  getRecordsByPatientId(patientId) {
    return axios.get(`${MEDICALRECORD_API_BASE_URL}medical-records`, {
      params: {
        id: patientId,
      },
    });
  }

  createMedicalRecord(medicalRecord){
    return axios.post("http://localhost:8083/medical-records", medicalRecord);
  }

  checkMicroserviceStatus(){
    return axios.get('http://localhost:8083/medical-records/status');
  }
}

export default new MedicalService();
