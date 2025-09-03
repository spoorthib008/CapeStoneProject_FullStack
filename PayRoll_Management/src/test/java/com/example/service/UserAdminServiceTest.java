package com.example.service;

import com.example.dto.CreateUserRequest;
import com.example.dto.UserStatusUpdateRequest;
import com.example.entity.User;
import com.example.exception.ConflictException;
import com.example.exception.ResourceNotFoundException;
import com.example.repo.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserAdminServiceTest {

    @Mock private UserRepository userRepo;
    @Mock private PasswordEncoder encoder;

    @InjectMocks private UserAdminService svc;

    @Test
    void create_success() {
        CreateUserRequest req = new CreateUserRequest();
        req.setUsername("u1");
        req.setPassword("p1");
        req.setEmail("e@x.com");
        req.setEnabled(true);

        when(userRepo.findByUsername("u1")).thenReturn(Optional.empty());
        when(encoder.encode("p1")).thenReturn("enc");
        when(userRepo.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User u = svc.create(req);
        assertEquals("u1", u.getUsername());
        assertEquals("enc", u.getPassword());
    }

    @Test
    void create_duplicate_throws() {
        CreateUserRequest req = new CreateUserRequest();
        req.setUsername("u1");

        when(userRepo.findByUsername("u1")).thenReturn(Optional.of(new User()));
        assertThrows(ConflictException.class, () -> svc.create(req));
    }

    @Test
    void updateStatus_success() {
        User u = new User(); u.setId(5L); u.setEnabled(false);
        when(userRepo.findById(5L)).thenReturn(Optional.of(u));
        when(userRepo.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserStatusUpdateRequest req = new UserStatusUpdateRequest();
        req.setEnabled(true);

        User out = svc.updateStatus(5L, req);
        assertTrue(out.isEnabled());
    }

    @Test
    void updateStatus_notFound_throws() {
        when(userRepo.findById(9L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> svc.updateStatus(9L, new UserStatusUpdateRequest()));
    }
}
