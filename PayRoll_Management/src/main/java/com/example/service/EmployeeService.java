package com.example.service;

import com.example.dto.EmployeeCreateRequest;
import com.example.entity.Employee;
import com.example.entity.User;
import com.example.repo.EmployeeRepository;
import com.example.repo.LeaveRequestRepository;
import com.example.repo.PayrollItemRepository;
import com.example.repo.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepo;
    private final UserRepository userRepo;

    // NEW: extra repos for safe deletes (field-injected to avoid changing your constructor)
    @Autowired
    private LeaveRequestRepository leaveRepo;

    @Autowired
    private PayrollItemRepository payrollItemRepo;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepo, UserRepository userRepo) {
        this.employeeRepo = employeeRepo;
        this.userRepo = userRepo;
    }

    public List<Employee> listAll() {
        return employeeRepo.findAll();
    }

    public Employee get(Long id) {
        return employeeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    /**
     * Create an employee. Body must include a linked user id:
     * {
     *   "user": { "id": 5 },
     *   "firstName": "...", ...
     * }
     */
    @Transactional
    public Employee create(Employee employee) {
        // Ensure a valid existing user is linked so user_id is not null
        if (employee.getUser() == null || employee.getUser().getId() == null) {
            throw new IllegalArgumentException("user.id is required when creating an employee");
        }

        Long userId = employee.getUser().getId();
        User u = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Attach a managed User entity (prevents transient user and sets user_id properly)
        employee.setUser(u);

        return employeeRepo.save(employee);
    }

    /**
     * Update only mutable fields. If the request body contains "user": {"id": X},
     * the employee will be re-linked to that user (must exist).
     */
    @Transactional
    public Employee update(Long id, Employee data) {
        Employee e = get(id);

        // Optional: relink to another existing user if provided
        if (data.getUser() != null && data.getUser().getId() != null) {
            Long newUserId = data.getUser().getId();
            User u = userRepo.findById(newUserId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + newUserId));
            e.setUser(u);
        }

        // Update mutable fields
        e.setFirstName(data.getFirstName());
        e.setLastName(data.getLastName());
        e.setDob(data.getDob());
        e.setPhone(data.getPhone());
        e.setAddress(data.getAddress());
        e.setDesignation(data.getDesignation());
        e.setDepartment(data.getDepartment());
        e.setBaseSalary(data.getBaseSalary());

        return employeeRepo.save(e);
    }

    /**
     * NEW: Create employee by linking an existing user via userId (used by Admin UI).
     * Body example:
     * {
     *   "userId": 7,
     *   "firstName": "...", "lastName": "...",
     *   "dob": "1998-03-15", "phone": "...", "address": "...",
     *   "designation": "...", "department": "...", "baseSalary": 50000
     * }
     */
    @Transactional
    public Employee createFromUserId(EmployeeCreateRequest req) {
        if (req.getUserId() == null) {
            throw new IllegalArgumentException("userId is required when creating an employee");
        }

        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + req.getUserId()));

        // prevent duplicate profile for the same user
        employeeRepo.findByUserId(user.getId()).ifPresent(e -> {
            throw new RuntimeException("Employee profile already exists for userId=" + user.getId());
        });

        Employee e = new Employee();
        e.setUser(user);
        e.setFirstName(req.getFirstName());
        e.setLastName(req.getLastName());
        e.setDob(req.getDob());
        e.setPhone(req.getPhone());
        e.setAddress(req.getAddress());
        e.setDesignation(req.getDesignation());
        e.setDepartment(req.getDepartment());
        e.setBaseSalary(req.getBaseSalary());

        return employeeRepo.save(e);
    }

    /**
     * Delete employee safely: remove dependent rows first to satisfy FK constraints.
     */
    @Transactional
    public void delete(Long id) {
        Employee e = get(id);
        // remove dependents first (if these repos have deleteByEmployee)
        if (payrollItemRepo != null) {
            payrollItemRepo.deleteByEmployee(e);
        }
        if (leaveRepo != null) {
            leaveRepo.deleteByEmployee(e);
        }
        employeeRepo.delete(e);
    }
}
