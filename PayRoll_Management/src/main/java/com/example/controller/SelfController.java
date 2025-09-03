package com.example.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.ProfileDTO;
import com.example.entity.Employee;
import com.example.entity.LeaveRequest;
import com.example.entity.LeaveType;
import com.example.entity.PayrollItem;
import com.example.entity.User;
import com.example.repo.EmployeeRepository;
import com.example.repo.UserRepository;
import com.example.service.LeaveService;
import com.example.service.PayrollService;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("/api/v1")
public class SelfController {

    private final UserRepository userRepo;
    private final EmployeeRepository employeeRepo;
    private final PayrollService payrollService;
    private final LeaveService leaveService;

    @Autowired
    public SelfController(UserRepository userRepo,
                          EmployeeRepository employeeRepo,
                          PayrollService payrollService,
                          LeaveService leaveService) {
        this.userRepo = userRepo;
        this.employeeRepo = employeeRepo;
        this.payrollService = payrollService;
        this.leaveService = leaveService;
    }

    private Employee me(Authentication auth) {
        String username = auth.getName();
        User u = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // UPDATED: use findByUserId instead of findByUser
        return employeeRepo.findByUserId(u.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found for user: " + username));
    }

    @GetMapping("/profile")
    public ResponseEntity<Employee> myProfile(Authentication auth) {
        return ResponseEntity.ok(me(auth));
    }

    @PutMapping("/profile")
    public ResponseEntity<Employee> updateProfile(Authentication auth, @RequestBody ProfileDTO dto) {
        Employee e = me(auth);
        if (dto.getPhone() != null) e.setPhone(dto.getPhone());
        if (dto.getAddress() != null) e.setAddress(dto.getAddress());
        if (dto.getDesignation() != null) e.setDesignation(dto.getDesignation());
        if (dto.getDepartment() != null) e.setDepartment(dto.getDepartment());
        return ResponseEntity.ok(employeeRepo.save(e));
    }

    @GetMapping("/payroll/my/{year}/{month}")
    public ResponseEntity<com.example.dto.PayrollItemDTO> mySlip(
            Authentication auth,
            @PathVariable @jakarta.validation.constraints.Min(2000) @jakarta.validation.constraints.Max(3000) int year,
            @PathVariable @jakarta.validation.constraints.Min(1) @jakarta.validation.constraints.Max(12) int month) {

        return ResponseEntity.ok(payrollService.mySlipDto(year, month, me(auth)));
    }

    @GetMapping("/leave/my")
    public ResponseEntity<List<LeaveRequest>> myLeaves(Authentication auth) {
        return ResponseEntity.ok(leaveService.myLeaves(me(auth)));
    }

    @PostMapping("/leave")
    public ResponseEntity<LeaveRequest> applyLeave(Authentication auth,
                                                   @RequestParam String startDate,
                                                   @RequestParam String endDate,
                                                   @RequestParam(defaultValue = "PAID") LeaveType type) {
        LocalDate s = LocalDate.parse(startDate);
        LocalDate e = LocalDate.parse(endDate);
        return ResponseEntity.ok(leaveService.apply(me(auth), s, e, type));
    }
}
