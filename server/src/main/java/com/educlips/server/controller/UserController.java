package com.educlips.server.controller;

import com.educlips.server.dto.UserResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.educlips.server.dto.SignupRequest;

@RestController
public class UserController {

    @GetMapping("/users/test")
    public UserResponse testUser() {
        return new UserResponse(
                1L,
                "Ritesh",
                "ritesh@email.com",
                "STUDENT"
        );
    }

@PostMapping("/users/signup")
public UserResponse signup(@RequestBody SignupRequest request) {

    return new UserResponse(
            1L,
            request.getName(),
            request.getEmail(),
            request.getRole()
    );
}
}
