package com.example.controller;

import com.example.entity.User;
import com.example.repo.UserRepository;
import com.example.service.UserAdminService;
import com.example.dto.CreateUserRequest;
import com.example.dto.UserStatusUpdateRequest;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UsersController {

    private final UserRepository userRepo;
    private final UserAdminService userAdminService;

    @Autowired
    public UsersController(UserRepository userRepo, UserAdminService userAdminService) {
        this.userRepo = userRepo;
        this.userAdminService = userAdminService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        User u = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Map<String, Object> res = new HashMap<>();
        res.put("id", u.getId());
        res.put("username", u.getUsername());
        res.put("role", u.getRole().name());
        res.put("enabled", u.isEnabled());
        return ResponseEntity.ok(res);
    }

    // ✅ NEW: List users (Admin) — supports optional filters: ?role=ADMIN|EMPLOYEE&enabled=true|false
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserRow>> listUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean enabled
    ) {
        String roleFilter = (role == null ? null : role.trim().toUpperCase(Locale.ROOT));

        List<UserRow> out = userRepo.findAll().stream()
                .filter(u -> roleFilter == null || u.getRole().name().equals(roleFilter))
                .filter(u -> enabled == null || u.isEnabled() == enabled.booleanValue())
                .map(UsersController::toRow)
                .collect(Collectors.toList());

        return ResponseEntity.ok(out);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> create(@Valid @RequestBody CreateUserRequest req) {
        User saved = userAdminService.create(req);
        saved.setPassword(null); // don’t expose hash
        return ResponseEntity.ok(saved);
    }

    // Update user status (Admin)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateStatus(@PathVariable Long id,
                                             @Valid @RequestBody UserStatusUpdateRequest req) {
        User saved = userAdminService.updateStatus(id, req);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    // -------- helper + lightweight DTO (no password) --------

    private static UserRow toRow(User u) {
        UserRow r = new UserRow();
        r.setId(u.getId());
        r.setUsername(u.getUsername());
        r.setEmail(u.getEmail());
        r.setRole(u.getRole().name());
        r.setEnabled(u.isEnabled());
        return r;
    }

    public static class UserRow {
        private Long id;
        private String username;
        private String email;
        private String role;
        private boolean enabled;

        public UserRow() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
    }
}
