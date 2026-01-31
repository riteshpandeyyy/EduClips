package com.educlips.server.controller;

import com.educlips.server.dto.SignupRequest;
import com.educlips.server.dto.UserResponse;
import com.educlips.server.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;


@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

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
    public UserResponse signup(@Valid @RequestBody SignupRequest request) {
    return userService.signup(request);
}

}
