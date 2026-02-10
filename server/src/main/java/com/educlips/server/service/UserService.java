package com.educlips.server.service;

import com.educlips.server.dto.CreateCreatorProfileRequest;
import com.educlips.server.dto.LoginResponse;
import com.educlips.server.dto.SignupRequest;
import com.educlips.server.dto.UserResponse;
import org.springframework.stereotype.Service;
import com.educlips.server.entity.UserEntity;
import com.educlips.server.exception.EmailAlreadyExistsException;
import com.educlips.server.exception.InvalidCredentialsException;
import com.educlips.server.exception.UserNotFoundException;
import com.educlips.server.repository.CreatorProfileRepository;
import com.educlips.server.repository.UserRepository;
import com.educlips.server.security.JwtUtil;
import java.util.HashMap;
import java.util.Map;
import com.educlips.server.entity.UserRole;
import java.util.List;
import com.educlips.server.entity.CreatorProfileEntity;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;




@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CreatorProfileRepository creatorProfileRepository;
    
    public UserService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            CreatorProfileRepository creatorProfileRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.creatorProfileRepository = creatorProfileRepository;
    }


    public UserResponse signup(SignupRequest request) {

    // Check if email already exists
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new EmailAlreadyExistsException("Email already registered");
    }

    // Create user entity
    UserEntity user = new UserEntity();

    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(UserRole.valueOf(request.getRole())
);


    // Save user
    UserEntity savedUser = userRepository.save(user);

    // Return response (NO password)
    return new UserResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole().name()
    );
}


    public LoginResponse login(String email, String password) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());

        String token = jwtUtil.generateToken(
                user.getEmail(),
                claims
        );

        return new LoginResponse(token);
    }

    public UserEntity getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Page<UserResponse> getAllUsers(int page, int size) {

    Pageable pageable = PageRequest.of(page, size);

    return userRepository.findAll(pageable)
            .map(user -> new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name()
            ));
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {

        return userRepository.findAll(pageable)
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                ));
    }

    public CreatorProfileEntity createCreatorProfile(
            String email,
            CreateCreatorProfileRequest request
    ) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("CREATOR")) {
            throw new InvalidCredentialsException("Only creators can create profile");
        }

        if (creatorProfileRepository.findByUser(user).isPresent()) {
            throw new InvalidCredentialsException("Creator profile already exists");
        }

        CreatorProfileEntity profile = new CreatorProfileEntity();
        profile.setUser(user);
        profile.setBio(request.getBio());
        profile.setExpertise(request.getExpertise());

        return creatorProfileRepository.save(profile);
    }

    public CreatorProfileEntity getMyCreatorProfile(String email) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.CREATOR) {
            throw new RuntimeException("Only creators have profiles");
        }

        return creatorProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Creator profile not found"));
    }

    public CreatorProfileEntity getCreatorProfileById(Long id) {
        return creatorProfileRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Creator profile not found"));
    }


}
