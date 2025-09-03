package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.dto.CreateUserRequest;
import com.example.dto.UserStatusUpdateRequest;
import com.example.entity.User;
import com.example.exception.ConflictException;
import com.example.exception.ResourceNotFoundException;
import com.example.repo.UserRepository;

@Service
public class UserAdminService {
	private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Autowired
    public UserAdminService(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    public User create(CreateUserRequest req) {
        userRepo.findByUsername(req.getUsername()).ifPresent(u -> {
            throw new ConflictException("Username already exists: " + req.getUsername());
        });
        User u = new User();
        u.setUsername(req.getUsername());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setEmail(req.getEmail());
        u.setRole(req.getRole());
        u.setEnabled(req.isEnabled());
        return userRepo.save(u);
    }

    public User updateStatus(Long id, UserStatusUpdateRequest req) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        u.setEnabled(req.isEnabled());
        return userRepo.save(u);
    }
}


