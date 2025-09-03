package com.example.service;

import com.example.dto.EmployeeCreateRequest;
import com.example.entity.Employee;
import com.example.entity.User;
import com.example.repo.EmployeeRepository;
import com.example.repo.LeaveRequestRepository;
import com.example.repo.PayrollItemRepository;
import com.example.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock private EmployeeRepository employeeRepo;
    @Mock private UserRepository userRepo;
    @Mock private LeaveRequestRepository leaveRepo;
    @Mock private PayrollItemRepository payrollItemRepo;

    @InjectMocks
    private EmployeeService employeeService;

    @BeforeEach
    void wireFieldInjectedRepos() {
        // Your service field-injects these; use reflection to set them in tests
        ReflectionTestUtils.setField(employeeService, "leaveRepo", leaveRepo);
        ReflectionTestUtils.setField(employeeService, "payrollItemRepo", payrollItemRepo);
    }

    @Test
    void listAll_returnsEmployees() {
        when(employeeRepo.findAll()).thenReturn(List.of(new Employee(), new Employee()));
        List<Employee> out = employeeService.listAll();
        assertEquals(2, out.size());
        verify(employeeRepo).findAll();
    }

    @Test
    void get_found() {
        Employee e = new Employee();
        e.setId(10L);
        when(employeeRepo.findById(10L)).thenReturn(Optional.of(e));

        Employee got = employeeService.get(10L);
        assertEquals(10L, got.getId());
    }

    @Test
    void get_notFound_throws() {
        when(employeeRepo.findById(99L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> employeeService.get(99L));
        assertTrue(ex.getMessage().contains("Employee not found"));
    }

    @Test
    void create_withNestedUserId_success() {
        User u = new User();
        u.setId(5L);
        when(userRepo.findById(5L)).thenReturn(Optional.of(u));

        Employee in = new Employee();
        User nested = new User(); nested.setId(5L);
        in.setUser(nested);
        when(employeeRepo.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        Employee saved = employeeService.create(in);
        assertNotNull(saved.getUser());
        assertEquals(5L, saved.getUser().getId());
        verify(employeeRepo).save(any(Employee.class));
    }

    @Test
    void create_missingUserId_throws() {
        Employee in = new Employee();
        RuntimeException ex = assertThrows(IllegalArgumentException.class, () -> employeeService.create(in));
        assertTrue(ex.getMessage().contains("user.id is required"));
    }

    @Test
    void update_updatesFieldsAndRelinksUserIfProvided() {
        Employee existing = new Employee();
        existing.setId(1L);
        existing.setFirstName("Old");

        when(employeeRepo.findById(1L)).thenReturn(Optional.of(existing));

        User newUser = new User(); newUser.setId(7L);
        when(userRepo.findById(7L)).thenReturn(Optional.of(newUser));
        when(employeeRepo.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        Employee patch = new Employee();
        User patchUser = new User(); patchUser.setId(7L);
        patch.setUser(patchUser);
        patch.setFirstName("NewF");
        patch.setLastName("NewL");

        Employee out = employeeService.update(1L, patch);
        assertEquals("NewF", out.getFirstName());
        assertEquals("NewL", out.getLastName());
        assertEquals(7L, out.getUser().getId());
    }

    @Test
    void createFromUserId_success() {
        EmployeeCreateRequest req = new EmployeeCreateRequest();
        req.setUserId(9L);
        req.setFirstName("A");

        User u = new User(); u.setId(9L);
        when(userRepo.findById(9L)).thenReturn(Optional.of(u));
        when(employeeRepo.findByUserId(9L)).thenReturn(Optional.empty());
        when(employeeRepo.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        Employee e = employeeService.createFromUserId(req);
        assertEquals(9L, e.getUser().getId());
        assertEquals("A", e.getFirstName());
    }

    @Test
    void createFromUserId_duplicate_throws() {
        EmployeeCreateRequest req = new EmployeeCreateRequest();
        req.setUserId(9L);

        when(userRepo.findById(9L)).thenReturn(Optional.of(new User()));
        when(employeeRepo.findByUserId(9L)).thenReturn(Optional.of(new Employee()));

        // Only assert the exception type (message can vary)
        assertThrows(RuntimeException.class, () -> employeeService.createFromUserId(req));

        // And assert the important behavior: save must NOT be called
        verify(employeeRepo, never()).save(any(Employee.class));
    }

    @Test
    void delete_cascadesDependents() {
        Employee e = new Employee(); e.setId(3L);
        when(employeeRepo.findById(3L)).thenReturn(Optional.of(e));

        employeeService.delete(3L);

        verify(payrollItemRepo).deleteByEmployee(e);
        verify(leaveRepo).deleteByEmployee(e);
        verify(employeeRepo).delete(e);
    }
}
