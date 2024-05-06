package com.example.patientmanagement.controller;

import com.example.patientmanagement.data.Doctor;
import com.example.patientmanagement.data.Patient;
import com.example.patientmanagement.data.User;
import com.example.patientmanagement.service.DoctorService;
import com.example.patientmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static java.lang.Integer.parseInt;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserService userService;

    @GetMapping(path = "/doctors/{id}")
    public Optional<Doctor> findById(@PathVariable int id){
        return doctorService.findById(id);
    }

    @GetMapping(path = "/doctors")
    public List<Doctor> getAllDoctors(){
        return doctorService.getAllDoctors();
    }

    @GetMapping(path = "/doctors", params = "id")
    public String findNameById(@RequestParam int id){
        System.out.println("Doctor ID: "+id);
        return doctorService.findNameById(id);
    }

    @GetMapping(value = "/doctors", params = "nic")
    public ResponseEntity<Boolean> existsByNic(@RequestParam String nic){
        boolean nicExists = doctorService.existsByNic(nic);
        return ResponseEntity.ok(nicExists);
    }

    @PostMapping(path = "/doctors")
    public ResponseEntity<?> createDoctor(@RequestBody Doctor doctor) {
        if (doctorService.isDoctorNICExists(doctor.getNic())) {
            System.out.println("A doctor with the same NIC already exists :"+doctor.getNic());
            return ResponseEntity.badRequest().body("A doctor with the same NIC already exists :"+doctor.getNic());
        } else {
            User user = new User();
            int userNic = doctor.getDoctorNumber();
            user.setPatientNumber(userNic);
            user.setRole("doctor");
            userService.createUser(user);
            System.out.println("User Created [DOCTOR].");

            doctorService.createDoctor(doctor);
            System.out.println("Doctor Created.");
            return ResponseEntity.ok("Doctor Created.");
        }
    }

    @GetMapping(path = "/doctors/new")
    public int getLastDoctorNumber(){
        int lastDoctorNumber = doctorService.getLastDoctorNumber();
        System.out.println("Last Doctor Number: "+doctorService.getLastDoctorNumber());
        int nextDoctorNumber = lastDoctorNumber+1;
        return  nextDoctorNumber;
    }

}
