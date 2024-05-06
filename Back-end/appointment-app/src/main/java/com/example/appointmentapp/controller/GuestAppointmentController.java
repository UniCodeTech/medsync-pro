package com.example.appointmentapp.controller;

import com.example.appointmentapp.data.GuestAppointment;
import com.example.appointmentapp.service.GuestAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class GuestAppointmentController {

    @Autowired
    private GuestAppointmentService guestAppointmentService;

    //create
    @PostMapping(path = "/guest-appointments")
    public GuestAppointment create(@RequestBody GuestAppointment guestAppointment){
        System.out.println("Received Create Requet: "+guestAppointment.getGuestName());
        return guestAppointmentService.create(guestAppointment);
    }

    // get all
    @GetMapping(path = "/guest-appointments")
    public List<GuestAppointment> getAll(){
        return guestAppointmentService.getAll();
    }
}
