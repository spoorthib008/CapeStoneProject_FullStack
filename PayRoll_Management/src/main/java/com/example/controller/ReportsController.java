package com.example.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.DepartmentCostRow;
import com.example.dto.PayrollSummaryResponse;
import com.example.service.ReportService;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/api/v1/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportsController {

    private final ReportService reportService;

    @Autowired
    public ReportsController(ReportService reportService) { this.reportService = reportService; }

    // NEW 6: Payroll summary for a month
    @GetMapping("/payroll-summary")
    public ResponseEntity<PayrollSummaryResponse> payrollSummary(
            @RequestParam @Min(2000) @Max(3000) int year,
            @RequestParam @Min(1) @Max(12) int month) {
        return ResponseEntity.ok(reportService.payrollSummary(year, month));
    }

    // NEW 7: Department cost for a month
    @GetMapping("/department-cost")
    public ResponseEntity<List<DepartmentCostRow>> departmentCost(
            @RequestParam @Min(2000) @Max(3000) int year,
            @RequestParam @Min(1) @Max(12) int month) {
        return ResponseEntity.ok(reportService.departmentCost(year, month));
    }
}
