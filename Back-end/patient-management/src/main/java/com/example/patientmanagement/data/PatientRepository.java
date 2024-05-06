package com.example.patientmanagement.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {

    @Query("select p from Patient p where p.nic = ?1")
    public Patient findByNic(String nic);

    @Query("select p from Patient p where p.patientNumber = ?1")
    public Patient findByPatientNumber(int patientNumber);

    @Query("SELECT MAX(p.id) FROM Patient p")
    public int getLastIndex();

    @Query("SELECT p from Patient p where p.nic = ?1")
    public Patient checkNicAvailability(String nic);

//    @Query("SELECT p from Patient p where p.nic = ?1")
//    boolean existsByNic(String nic);

//    @Query("SELECT p from Patient p where p.nic = ?1")
    boolean existsByNic(String nic);

    @Query("Select p.lastName from Patient p where p.id = ?1")
    public String findNameById(int id);

    @Query("SELECT MAX(p.patientNumber) FROM Patient p")
    public int getLastPatientNumber();
}
