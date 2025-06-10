package com.fitness.userservice.service;

import org.springframework.stereotype.Service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@AllArgsConstructor
public class UserService {

    private UserRepository userRepository;

    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        UserResponse userResponse = new UserResponse();
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setId(user.getId());
        userResponse.setPassword(user.getPassword());
        userResponse.setUpdatedAt(user.getUpdatedAt());

        return userResponse;
    }

    public UserResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail()))
        {
            User existingUser = userRepository.findByEmail(request.getEmail());
            UserResponse userResponse = new UserResponse();
            userResponse.setCreatedAt(existingUser.getCreatedAt());
            userResponse.setKeycloakId(existingUser.getKeycloakId());
            userResponse.setEmail(existingUser.getEmail());
            userResponse.setFirstName(existingUser.getFirstName());
            userResponse.setLastName(existingUser.getLastName());
            userResponse.setId(existingUser.getId());
            userResponse.setPassword(existingUser.getPassword());
            userResponse.setUpdatedAt(existingUser.getUpdatedAt());

            return userResponse;
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setKeycloakId(request.getKeycloakId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = userRepository.save(user);

        UserResponse userResponse = new UserResponse();
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setKeycloakId(request.getKeycloakId());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setFirstName(savedUser.getFirstName());
        userResponse.setLastName(savedUser.getLastName());
        userResponse.setId(savedUser.getId());
        userResponse.setPassword(savedUser.getPassword());
        userResponse.setUpdatedAt(savedUser.getUpdatedAt());

        return userResponse;
    }

    public Boolean existByUserId(String userId) {
        log.info("calling user validation api for User id: {}", userId);
        return userRepository.existsByKeycloakId(userId);
    }
    
}
