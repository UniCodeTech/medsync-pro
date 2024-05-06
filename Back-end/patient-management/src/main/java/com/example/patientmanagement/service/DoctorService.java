package com.example.patientmanagement.service;

import com.example.patientmanagement.data.Doctor;
import com.example.patientmanagement.data.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public Optional<Doctor> findById(int id){
        return doctorRepository.findById(id);
    }

    public List<Doctor> getAllDoctors(){
        return doctorRepository.findAll();
    }

    public String findNameById(int id){
        return doctorRepository.findNameById(id);
    }

    public boolean isDoctorNICExists(String nic) {
        return doctorRepository.existsByNic(nic);
    }

    public Doctor createDoctor(Doctor doctor){
        return doctorRepository.save(doctor);
    }

    public boolean existsByNic(String nic){
        return doctorRepository.existsByNic(nic);
    }

    public int getLastDoctorNumber(){
        return doctorRepository.getLastDoctorNumber();
    }
}
