package com.example.patientmanagement.service;

import com.example.patientmanagement.data.Patient;
import com.example.patientmanagement.data.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;


    // get all patients
    public List<Patient> getAllPatient(){
        return patientRepository.findAll();
    }

    public Patient createPatient(Patient patient){
        return patientRepository.save(patient);
    }

    public ResponseEntity<String> login(int id) {
        Optional<Patient> optionalPatient = patientRepository.findById(id);

        if (optionalPatient.isPresent()) {
            // Patient with the provided ID exists
            return new ResponseEntity<>("Login successful", HttpStatus.OK);
        } else {
            // Patient with the provided ID does not exist
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    public Patient findUserById(int id) {
        Optional<Patient> optionalPatient = patientRepository.findById(id);
        if (optionalPatient.isPresent()) {
            return optionalPatient.get();
        } else {
            return null; // Return null if the patient is not found
        }
    }

    public Patient updatePatient(Patient patient){
        return patientRepository.save(patient);
    }

    public Patient findByNic(String nic){
        return patientRepository.findByNic(nic);
    }
    public Patient findByPatientNumber(int patientNumber){
        return patientRepository.findByPatientNumber(patientNumber);
    }

    public int getLastIndex(){
        return patientRepository.getLastIndex();
    }

    public boolean isPatientNICExists(String nic) {
        return patientRepository.existsByNic(nic);
    }


    public boolean existsByNic(String nic){
        return patientRepository.existsByNic(nic);
    }

    public String findNameById(int id){
        return patientRepository.findNameById(id);
    }

    public int getLastPatientNumber(){
        return patientRepository.getLastPatientNumber();
    }
}
