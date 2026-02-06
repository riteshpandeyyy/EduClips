package com.educlips.server.service;

import com.educlips.server.dto.LoginResponse;
import com.educlips.server.dto.SignupRequest;
import com.educlips.server.dto.UserResponse;
import org.springframework.stereotype.Service;
import com.educlips.server.entity.UserEntity;
import com.educlips.server.exception.EmailAlreadyExistsException;
import com.educlips.server.exception.InvalidCredentialsException;
import com.educlips.server.exception.UserNotFoundException;
import com.educlips.server.repository.UserRepository;
import com.educlips.server.security.JwtUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;



@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public UserService(UserRepository userRepository,
                   BCryptPasswordEncoder passwordEncoder,
                   JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
    }


    public UserResponse signup(SignupRequest request) {

    // Check if email already exists
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new EmailAlreadyExistsException("Email already registered");
    }

    // Create user entity
    UserEntity user = new UserEntity(
            request.getName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword()), 
            request.getRole()
    );

    // Save user
    UserEntity savedUser = userRepository.save(user);

    // Return response (NO password)
    return new UserResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole()
    );
}


    public LoginResponse login(String email, String password) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

        return new LoginResponse(token);
    }

    public UserEntity getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }



}
