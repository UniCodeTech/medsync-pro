package com.example.patientmanagement.controller;

import com.example.patientmanagement.data.Patient;
import com.example.patientmanagement.data.User;
import com.example.patientmanagement.service.PatientService;
import com.example.patientmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private UserController userController;

    @Autowired
    private UserService userService;


    // get all Patients
    @GetMapping(path = "/patients")
    public List<Patient> getAllPatient(){
        return patientService.getAllPatient();
    }

    @GetMapping(path = "/patients/{id}")
    public ResponseEntity<?> findById(@PathVariable String id) {
        try {
            int userId = Integer.parseInt(id);
            System.out.println("User ID from React: " + userId);
            Patient patient = patientService.findUserById(userId);
            if (patient != null) {
                return ResponseEntity.ok(patient);
            } else {
                return ResponseEntity.notFound().build(); // Patient not found
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid 'id' format");
        }
    }

    @GetMapping(path = "/patients/nic/{nic}")
    public ResponseEntity<?> findByNic(@PathVariable String nic) {
        try {
            System.out.println("NIC from React: " + nic);
            Patient patient = patientService.findByNic(nic);
            if (patient != null) {
                return ResponseEntity.ok(patient);
            } else {
                return ResponseEntity.notFound().build(); // Patient not found
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid 'id' format");
        }
    }
    @GetMapping(path = "/patients/patient-number/{patientNumber}")
    public ResponseEntity<?> findByPatientNumber(@PathVariable int patientNumber) {
        try {
            System.out.println("Patient Number from React: " + patientNumber);
            Patient patient = patientService.findByPatientNumber(patientNumber);
            if (patient != null) {
                return ResponseEntity.ok(patient);
            } else {
                return ResponseEntity.notFound().build(); // Patient not found
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid 'id' format");
        }
    }

    @PutMapping(path = "/patients")
    public Patient updatePatient(@RequestBody Patient patient){
        System.out.println("Received update request : "+ patient.getId());
        return patientService.updatePatient(patient);
    }

    @PostMapping(path = "/patients")
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        // Check if a patient with the same NIC already exists
        User user = new User();
        user.setPatientNumber(patient.getPatientNumber());
        user.setRole("patient");
        userService.createUser(user);
        System.out.println("User Created.");

        Patient createdPatient = patientService.createPatient(patient);
        System.out.println("Patient Created.");
        return ResponseEntity.ok(createdPatient);
    }

    @GetMapping(value = "/patients", params = "nic")
    public ResponseEntity<Boolean> existsByNic(@RequestParam String nic){
        boolean nicExists = patientService.existsByNic(nic);
        return ResponseEntity.ok(nicExists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> login(@PathVariable int id) {
        return patientService.login(id);
    }

    @GetMapping(value = "/api/patients/login", params = {"id", "password"})
    public ResponseEntity<String> patientLogin(@RequestParam int id, @RequestParam String password) {
        Patient authenticatedPatient = patientService.findUserById(id);
        if (authenticatedPatient != null) {
            return ResponseEntity.ok("Patient logged in successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @GetMapping(path = "/patients", params = "id")
    public String findNameById(@RequestParam int id){
        System.out.println("Patient ID: "+id);
        return patientService.findNameById(id);
    }

    @GetMapping(path = "/patients/status")
    public Boolean checkStatus(){
        return true;
    }

    @GetMapping(path = "/patients/new")
    public int getLastPatientNumber(){
         int lastPatientNumber = patientService.getLastPatientNumber();
         System.out.println("Last Patient Number: "+patientService.getLastPatientNumber());
        int nextPatientNumber = lastPatientNumber+1;
        return  nextPatientNumber;
    }

}

