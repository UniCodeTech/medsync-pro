package com.example.appointmentapp.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
//    @Query("update Appointment a set a.status=a.status where u.id=?1")
//    Appointment updateAppointmentStatus(String status);

    @Query("SELECT a from Appointment a where a.patientId = ?1")
    public List<Appointment> getAppointmentsByPatientId(String id);
}
