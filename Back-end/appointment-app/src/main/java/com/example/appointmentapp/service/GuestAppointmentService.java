package com.example.appointmentapp.service;

import com.example.appointmentapp.data.GuestAppointment;
import com.example.appointmentapp.data.GuestAppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuestAppointmentService {

    @Autowired
    private GuestAppointmentRepository guestAppointmentRepository;

    //create
    public GuestAppointment create(GuestAppointment guestAppointment){
        return guestAppointmentRepository.save(guestAppointment);
    }

    // get all
    public List<GuestAppointment> getAll(){
        return guestAppointmentRepository.findAll();
    }
}
