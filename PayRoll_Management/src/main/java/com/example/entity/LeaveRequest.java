package com.example.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne( fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnore
    private Employee employee;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveType leaveType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveStatus status = LeaveStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime appliedAt = LocalDateTime.now();

    // ---- No-arg constructor
    public LeaveRequest() {}

    // ---- Getters
    public Long getId() { return id; }
    public Employee getEmployee() { return employee; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public LeaveType getLeaveType() { return leaveType; }
    public LeaveStatus getStatus() { return status; }
    public LocalDateTime getAppliedAt() { return appliedAt; }

    // ---- Setters
    public void setId(Long id) { this.id = id; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setLeaveType(LeaveType leaveType) { this.leaveType = leaveType; }
    public void setStatus(LeaveStatus status) { this.status = status; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
