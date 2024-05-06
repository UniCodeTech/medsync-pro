package com.example.appointmentapp.controller;

import com.example.appointmentapp.data.Appointment;
import com.example.appointmentapp.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping(path="/appointments")
    public Appointment createAppointment(@RequestBody Appointment appointment){
        return appointmentService.createAppointment(appointment);
    }

    @GetMapping(path="/appointments")
    public List<Appointment> getAllAppointment(){
        return appointmentService.getAllAppointment();
    }

    @GetMapping(path = "/appointments/{id}")
    public  List<Appointment> getAppointmentsByPatientId(@PathVariable String id){
        return appointmentService.getAppointmentsByPatientId(id);
    }

    @GetMapping(path = "/appointments/status")
    public Boolean checkStatus(){
        return true;
    }

}
