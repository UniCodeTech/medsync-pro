package com.example.patientmanagement.service;

import com.example.patientmanagement.data.User;
import com.example.patientmanagement.data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User userLogin(int patientNumber){
        return userRepository.login(patientNumber);
    }

    public List<User> show(){
        return userRepository.findAll();
    }

    public Optional<User> findById(int id){
        return userRepository.findById(id);
    }

    public User createUser(User user){
        return userRepository.save(user);
    }
}
