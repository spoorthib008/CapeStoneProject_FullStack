package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.ApproveLeaveRequest;
import com.example.entity.LeaveRequest;
import com.example.entity.LeaveStatus;
import com.example.exception.ResourceNotFoundException;
import com.example.repo.LeaveRequestRepository;
import com.example.service.LeaveService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/leave")
public class LeaveController {

    private final LeaveService leaveService;
    private final LeaveRequestRepository leaveRepo;

    @Autowired
    public LeaveController(LeaveService leaveService, LeaveRequestRepository leaveRepo) {
        this.leaveService = leaveService;
        this.leaveRepo = leaveRepo;
    }

    // Admin: list by status (PENDING by default)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequest>> listByStatus(
            @RequestParam(defaultValue = "PENDING") LeaveStatus status) {
        return ResponseEntity.ok(leaveService.allByStatus(status));
    }

    // Admin: get a single leave by id  (NEW)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveRequest> getOne(@PathVariable Long id) {
        LeaveRequest lr = leaveRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found: " + id));
        return ResponseEntity.ok(lr);
    }

    // Admin: approve/reject a leave
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveRequest> setStatus(@PathVariable Long id,
                                                  @Valid @RequestBody ApproveLeaveRequest req) {
        return ResponseEntity.ok(leaveService.setStatus(id, req.getStatus()));
    }
}
