package com.educlips.server.service;

import com.educlips.server.dto.SignupRequest;
import com.educlips.server.dto.UserResponse;
import org.springframework.stereotype.Service;
import com.educlips.server.entity.UserEntity;
import com.educlips.server.repository.UserRepository;


@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse signup(SignupRequest request) {

        UserEntity user = new UserEntity(
                request.getName(),
                request.getEmail(),
                request.getPassword(), // hashing later
                request.getRole()
        );

        UserEntity savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }
}
