package com.example.service;

import com.example.dto.AuthRequest;
import com.example.dto.AuthResponse;
import com.example.dto.RegisterRequest;
import com.example.entity.Employee;
import com.example.entity.Role;
import com.example.entity.User;
import com.example.repo.EmployeeRepository;
import com.example.repo.UserRepository;
import com.example.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void testLoginSuccess() {
        AuthRequest req = new AuthRequest("admin", "pass");
        User u = new User();
        u.setId(1L);
        u.setUsername("admin");
        u.setPassword("encoded");
        u.setRole(Role.ADMIN);

        Authentication auth = new UsernamePasswordAuthenticationToken("admin", "pass");
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(u));
        when(jwtService.generateToken("admin", "ADMIN")).thenReturn("jwtToken");

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("admin", res.getUsername());
        assertEquals("jwtToken", res.getAccessToken());
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("emp1");
        req.setPassword("pass");
        req.setEmail("e@x.com");
        req.setFirstName("Emp");
        req.setLastName("One");

        User u = new User();
        u.setId(2L);
        u.setUsername("emp1");
        u.setRole(Role.EMPLOYEE);

        when(userRepository.findByUsername("emp1")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(u);
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));
        when(jwtService.generateToken("emp1", "EMPLOYEE")).thenReturn("jwtToken");
        when(authenticationManager.authenticate(any())).thenReturn(mock(Authentication.class));

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals("emp1", res.getUsername());
        assertEquals("jwtToken", res.getAccessToken());
        assertEquals("EMPLOYEE", res.getRole());
    }

    @Test
    void testRegisterDuplicateUsername() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("admin");

        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(new User()));

        assertThrows(IllegalArgumentException.class, () -> authService.register(req));
    }
}
