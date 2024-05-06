package com.example.medical_record.controller;


import com.example.medical_record.data.MedicalRecord;
import com.example.medical_record.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class MedicalRecordController {
    @Autowired
    private MedicalRecordService medicalRecordService;

    @GetMapping(path = "/medical-records")
    public List<MedicalRecord> getAllMedicalRecords(){
        return medicalRecordService.getAllMedicalRecords();
    }

    //Get medical record by patient id
    @GetMapping(path = "/medical-records", params = "id")
    public List<MedicalRecord> getMedicalRecordByPatientId(@RequestParam int id){
        System.out.println("Request Received: Get Medical Record by Patient Id: "+id);
        return medicalRecordService.getMedicalRecordByPatientId(id);
    }


    @PostMapping(path = "/medical-records")
    public MedicalRecord createMedicalRecord(@RequestBody MedicalRecord medicalRecord){
        return medicalRecordService.createMedicalRecord(medicalRecord);
    }

    @PutMapping(path = "/medical-records/{id}")
    public MedicalRecord updateMedicalRecord(@RequestBody MedicalRecord medicalRecord){
        return medicalRecordService.updateMedicalRecord(medicalRecord);
    }

    @DeleteMapping (path = "/medical-records/{id}")
    public void deleteMedicalRecordById(@PathVariable int id){
        medicalRecordService.deleteMedicalRecordById(id);
    }

    @GetMapping(path = "/medical-records/status")
    public Boolean checkStatus(){
        return true;
    }


}
