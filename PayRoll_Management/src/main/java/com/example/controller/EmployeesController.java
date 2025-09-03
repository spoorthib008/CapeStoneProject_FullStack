package com.example.controller;

import com.example.dto.EmployeeCreateRequest;
import com.example.entity.Employee;
import com.example.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@PreAuthorize("hasRole('ADMIN')")
public class EmployeesController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeesController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<Employee>> list() {
        return ResponseEntity.ok(employeeService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> get(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.get(id));
    }

    /**
     * Existing: create employee with payload that includes:
     * { "user": { "id": X }, ... }
     */
    @PostMapping
    public ResponseEntity<Employee> create(@Valid @RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.create(employee));
    }

    /**
     * NEW: create employee by linking an existing user via userId.
     * POST /api/v1/employees/link
     *
     * Body:
     * {
     *   "userId": 7,
     *   "firstName": "...",
     *   "lastName": "...",
     *   "dob": "1998-03-15",
     *   "phone": "...",
     *   "address": "...",
     *   "designation": "...",
     *   "department": "...",
     *   "baseSalary": 50000
     * }
     */
    @PostMapping("/link")
    public ResponseEntity<Employee> createByUserId(@Valid @RequestBody EmployeeCreateRequest req) {
        return ResponseEntity.ok(employeeService.createFromUserId(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> update(@PathVariable Long id, @Valid @RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.update(id, employee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
