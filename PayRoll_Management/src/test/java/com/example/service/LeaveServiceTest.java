package com.example.service;

import com.example.entity.Employee;
import com.example.entity.LeaveRequest;
import com.example.entity.LeaveStatus;
import com.example.entity.LeaveType;
import com.example.repo.LeaveRequestRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock private LeaveRequestRepository leaveRepo;
    @InjectMocks private LeaveService leaveService;

    @Test
    void apply_success() {
        Employee emp = new Employee(); emp.setId(1L);
        LocalDate s = LocalDate.of(2025, 1, 10);
        LocalDate e = LocalDate.of(2025, 1, 12);

        when(leaveRepo.save(any(LeaveRequest.class))).thenAnswer(inv -> inv.getArgument(0));

        LeaveRequest out = leaveService.apply(emp, s, e, LeaveType.PAID);
        assertEquals(LeaveStatus.PENDING, out.getStatus());
        assertEquals(s, out.getStartDate());
        assertEquals(e, out.getEndDate());
    }

    @Test
    void apply_invalidDates_throws() {
        Employee emp = new Employee(); emp.setId(1L);
        LocalDate s = LocalDate.of(2025, 1, 12);
        LocalDate e = LocalDate.of(2025, 1, 10);

        assertThrows(IllegalArgumentException.class, () -> leaveService.apply(emp, s, e, LeaveType.SICK));
    }

    @Test
    void myLeaves_returnsList() {
        Employee me = new Employee(); me.setId(2L);
        when(leaveRepo.findByEmployee(me)).thenReturn(List.of(new LeaveRequest(), new LeaveRequest()));
        List<LeaveRequest> out = leaveService.myLeaves(me);
        assertEquals(2, out.size());
    }

    @Test
    void allByStatus_returnsList() {
        when(leaveRepo.findByStatus(LeaveStatus.PENDING)).thenReturn(List.of(new LeaveRequest()));
        assertEquals(1, leaveService.allByStatus(LeaveStatus.PENDING).size());
    }

    @Test
    void setStatus_success() {
        LeaveRequest lr = new LeaveRequest(); lr.setId(99L);
        when(leaveRepo.findById(99L)).thenReturn(Optional.of(lr));
        when(leaveRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        LeaveRequest out = leaveService.setStatus(99L, LeaveStatus.APPROVED);
        assertEquals(LeaveStatus.APPROVED, out.getStatus());
    }

    @Test
    void setStatus_notFound_throws() {
        when(leaveRepo.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> leaveService.setStatus(1L, LeaveStatus.REJECTED));
        assertTrue(ex.getMessage().contains("Leave not found"));
    }
}
