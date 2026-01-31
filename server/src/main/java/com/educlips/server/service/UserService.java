package com.educlips.server.service;

import com.educlips.server.dto.SignupRequest;
import com.educlips.server.dto.UserResponse;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public UserResponse signup(SignupRequest request) {

        // Business logic will grow here later
        return new UserResponse(
                1L,
                request.getName(),
                request.getEmail(),
                request.getRole()
        );
    }
}
