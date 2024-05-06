package com.example.medical_record.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {

    @Query("select r from MedicalRecord r where r.patient_id=?1")
    public List<MedicalRecord> getRecordByPatientId(int id);
}
