package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.dto.AuthRequest;
import com.example.dto.AuthResponse;
import com.example.dto.RegisterRequest;
import com.example.entity.Employee;
import com.example.entity.Role;
import com.example.entity.User;
import com.example.repo.EmployeeRepository;
import com.example.repo.UserRepository;
import com.example.security.JwtService;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       UserRepository userRepository,
                       EmployeeRepository employeeRepository,
                       PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ------------------ LOGIN (existing) ------------------
    public AuthResponse login(AuthRequest req) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        User u = userRepository.findByUsername(req.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + req.getUsername()));

        String token = jwtService.generateToken(u.getUsername(), u.getRole().name());

        return new AuthResponse(token, u.getId(), u.getUsername(), u.getRole().name());
    }

    // ------------------ REGISTER (new) ------------------
    /**
     * Public registration for a new EMPLOYEE user.
     * - Ensures username is unique
     * - Creates User (ROLE_EMPLOYEE) + basic Employee profile
     * - Authenticates and returns JWT + user info (same shape as login)
     */
    public AuthResponse register(RegisterRequest req) {
        // 1) Validate uniqueness of username (add email uniqueness if you need)
        userRepository.findByUsername(req.getUsername()).ifPresent(u -> {
            throw new IllegalArgumentException("Username already exists: " + req.getUsername());
        });

        // 2) Create User (EMPLOYEE)
        User u = new User();
        u.setUsername(req.getUsername());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setEmail(req.getEmail());
        u.setRole(Role.EMPLOYEE);
        u.setEnabled(true);
        u = userRepository.save(u);

        // 3) Create minimal Employee profile (optional fields)
        Employee e = new Employee();
        e.setUser(u);
        e.setFirstName(req.getFirstName());
        e.setLastName(req.getLastName());
        e.setPhone(req.getPhone());
        e.setAddress(req.getAddress());
        e.setDob(req.getDob());
        // e.setDepartment(...); e.setDesignation(...); e.setBaseSalary(...); // if you want defaults
        employeeRepository.save(e);

        // 4) Auto-login to issue JWT 
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        String token = jwtService.generateToken(u.getUsername(), u.getRole().name());

        return new AuthResponse(token, u.getId(), u.getUsername(), u.getRole().name());
    }
}
