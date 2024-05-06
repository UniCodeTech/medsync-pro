package com.example.patientmanagement.controller;

import com.example.patientmanagement.data.User;
import com.example.patientmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping(path = "/users", params = "patientNumber")
    public ResponseEntity<User> userLogin(@RequestParam int patientNumber) {
        User user = userService.userLogin(patientNumber);
        if (user != null) {
            System.out.println("Received login request for nic: " + patientNumber );
            return new ResponseEntity<>(user, HttpStatus.OK); // Successful login
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Failed login
        }
    }

    // Update user
    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable int id, @RequestBody User updatedUser) {
        System.out.println("Received update request: "+id);
        Optional<User> optionalUser = userService.findById(id);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setPatientNumber(updatedUser.getPatientNumber());
        userService.createUser(user); // Save the updated user to the database
        System.out.println("User Updated: "+user.getPatientNumber());

        return ResponseEntity.ok("User updated successfully");
    }


    @GetMapping(path = "/users")
    public List<User> show(){
        return userService.show();
    }

    @PostMapping(path = "/users")
    public User createUser(@RequestBody User user){
        System.out.println("Received user create Request");
        return userService.createUser(user);
    }
}
