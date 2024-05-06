package com.example.patientmanagement.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

    @Query("Select d.name from Doctor d where d.id = ?1")
    public String findNameById(int id);

//    @Query("SELECT d from Doctor d where d.nic = ?1")
    boolean existsByNic(String nic);

    @Query("SELECT MAX(d.doctorNumber) FROM Doctor d")
    public int getLastDoctorNumber();
}
