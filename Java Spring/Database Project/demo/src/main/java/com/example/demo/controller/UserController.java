package com.example.demo.controller;

import com.example.demo.exceptions.UserNotFoundException;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/user/{login}")
    public ResponseEntity<User> getUserByLogin(@PathVariable String login) throws SQLException {
        try {
            User user = userRepository.getUserByLogin(login);
            return ResponseEntity.ok(user);
        } catch (SQLException e) {
            return ResponseEntity.internalServerError().build();
        } catch (UserNotFoundException e) {
            return ResponseEntity.notFound().build();
        }

    }

    @PostMapping("/user")
    public ResponseEntity<Object> createUser(@RequestBody User user){
        try {
            userRepository.addUser(user);

            return ResponseEntity.ok().build();
        } catch (SQLException e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
