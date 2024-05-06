package com.example.medical_record.service;

import com.example.medical_record.data.MedicalRecord;
import com.example.medical_record.data.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class MedicalRecordService {
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public List<MedicalRecord> getAllMedicalRecords(){
        return medicalRecordRepository.findAll();
    }

    public List<MedicalRecord> getMedicalRecordByPatientId(int id){
        return medicalRecordRepository.getRecordByPatientId(id);
    }

    public MedicalRecord createMedicalRecord(MedicalRecord medicalRecord){
        return medicalRecordRepository.save(medicalRecord);
    }

    public MedicalRecord updateMedicalRecord(@RequestBody MedicalRecord medicalRecord){
        return medicalRecordRepository.save(medicalRecord);
    }

    public void deleteMedicalRecordById(int id){
        medicalRecordRepository.deleteById(id);
    }


}
