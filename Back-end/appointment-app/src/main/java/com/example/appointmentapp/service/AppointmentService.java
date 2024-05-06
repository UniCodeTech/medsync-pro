package com.example.appointmentapp.service;

import com.example.appointmentapp.data.Appointment;
import com.example.appointmentapp.data.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Appointment createAppointment(Appointment appointment){
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointment(){
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByPatientId(String id){
        return appointmentRepository.getAppointmentsByPatientId(id);
    }

}
