package com.educlips.server.controller;

import com.educlips.server.dto.LoginRequest;
import com.educlips.server.dto.LoginResponse;
import com.educlips.server.dto.SignupRequest;
import com.educlips.server.dto.UserResponse;
import com.educlips.server.entity.UserEntity;
import com.educlips.server.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/test")
    public UserResponse testUser() {
        return new UserResponse(
                1L,
                "Ritesh",
                "ritesh@email.com",
                "STUDENT"
        );
    }

    @PostMapping("/signup")
    public UserResponse signup(@Valid @RequestBody SignupRequest request) {
        return userService.signup(request);
    }

    @PostMapping("/login")
        public LoginResponse login(@RequestBody LoginRequest request) {
           return userService.login(request.getEmail(), request.getPassword());
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {

        String email = authentication.getName(); // extracted from JWT
        UserEntity user = userService.getCurrentUser(email);

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    @PreAuthorize("hasRole('CREATOR')")
    @GetMapping("/creator-only")
    public String creatorOnlyEndpoint() {
        return "Hello Creator";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String adminOnly() {
        return "Hello Admin";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public Page<UserResponse> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return userService.getAllUsers(page, size);
    }


}
