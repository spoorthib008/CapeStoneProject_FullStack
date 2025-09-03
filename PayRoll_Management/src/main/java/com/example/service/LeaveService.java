package com.example.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.entity.Employee;
import com.example.entity.LeaveRequest;
import com.example.entity.LeaveStatus;
import com.example.entity.LeaveType;
import com.example.repo.LeaveRequestRepository;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRepo;

    @Autowired
    public LeaveService(LeaveRequestRepository leaveRepo) {
        this.leaveRepo = leaveRepo;
    }

    /** Employee applies for leave. */
    public LeaveRequest apply(Employee employee, LocalDate start, LocalDate end, LeaveType type) {
        if (start == null || end == null || start.isAfter(end)) {
            throw new IllegalArgumentException("Invalid leave dates.");
        }
        LeaveRequest lr = new LeaveRequest();
        lr.setEmployee(employee);
        lr.setStartDate(start);
        lr.setEndDate(end);
        lr.setLeaveType(type);
        lr.setStatus(LeaveStatus.PENDING);
        return leaveRepo.save(lr);
    }

    /** List all leaves for the current employee. */
    public List<LeaveRequest> myLeaves(Employee me) {
        return leaveRepo.findByEmployee(me);
    }

    /** Admin: list leaves by status. */
    public List<LeaveRequest> allByStatus(LeaveStatus status) {
        return leaveRepo.findByStatus(status);
    }

    /** Admin: approve or reject a leave. */
    public LeaveRequest setStatus(Long leaveId, LeaveStatus newStatus) {
        LeaveRequest lr = leaveRepo.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found: " + leaveId));
        lr.setStatus(newStatus);              // <-- works because entity has setStatus(...)
        return leaveRepo.save(lr);
    }
}


