package com.example.appointmentapp.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuestAppointmentRepository extends JpaRepository<GuestAppointment, Integer> {
}
