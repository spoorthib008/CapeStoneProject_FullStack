package com.example.entity;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "payroll_runs",
    uniqueConstraints = @UniqueConstraint(columnNames = {"year", "month"})
)
public class PayrollRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g., 2025
    @Column(nullable = false)
    private int year;

    // 1..12
    @Column(nullable = false)
    private int month;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayrollRunStatus status = PayrollRunStatus.DRAFT;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // ----- constructors -----
    public PayrollRun() {}

    public PayrollRun(int year, int month) {
        this.year = year;
        this.month = month;
        this.status = PayrollRunStatus.DRAFT;
        this.createdAt = LocalDateTime.now();
    }

    // ----- getters -----
    public Long getId() { return id; }
    public int getYear() { return year; }
    public int getMonth() { return month; }
    public PayrollRunStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ----- setters -----
    public void setId(Long id) { this.id = id; }
    public void setYear(int year) { this.year = year; }
    public void setMonth(int month) { this.month = month; }
    public void setStatus(PayrollRunStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


