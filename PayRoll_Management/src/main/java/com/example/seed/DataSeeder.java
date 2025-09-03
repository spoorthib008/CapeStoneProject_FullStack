package com.example.seed;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.entity.Employee;
import com.example.entity.Role;
import com.example.entity.User;
import com.example.repo.EmployeeRepository;
import com.example.repo.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final EmployeeRepository empRepo;
    private final PasswordEncoder encoder;

    @Autowired
    public DataSeeder(UserRepository userRepo,
                      EmployeeRepository empRepo,
                      PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.empRepo = empRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        seedUsersAndEmployees();
    }

    private void seedUsersAndEmployees() {
        // ---- Admin user (no employee profile) ----
        createUserIfNotExists("admin", "admin123", "admin@example.com", Role.ADMIN, false);

        // ---- John + employee profile ----
        User john = createUserIfNotExists("john", "john123", "john@example.com", Role.EMPLOYEE, true);
        createEmployeeIfNotExists(
                john,
                "John", "Doe",
                LocalDate.of(1994, 5, 12),
                "9999999990",
                "Bangalore, KA",
                "Software Engineer",
                "Engineering",
                new BigDecimal("60000.00")
        );

        // ---- Jane + employee profile ----
        User jane = createUserIfNotExists("jane", "jane123", "jane@example.com", Role.EMPLOYEE, true);
        createEmployeeIfNotExists(
                jane,
                "Jane", "Smith",
                LocalDate.of(1996, 2, 23),
                "9999999991",
                "Pune, MH",
                "HR Executive",
                "HR",
                new BigDecimal("45000.00")
        );
    }

    private User createUserIfNotExists(String username,
                                       String rawPassword,
                                       String email,
                                       Role role,
                                       boolean enabled) {
        Optional<User> existing = userRepo.findByUsername(username);
        if (existing.isPresent()) {
            return existing.get();
        }

        User u = new User();
        u.setUsername(username);
        u.setPassword(encoder.encode(rawPassword)); // encode!
        u.setEmail(email);
        u.setRole(role);
        u.setEnabled(enabled);
        return userRepo.save(u);
    }

    private void createEmployeeIfNotExists(User user,
                                           String firstName,
                                           String lastName,
                                           LocalDate dob,
                                           String phone,
                                           String address,
                                           String designation,
                                           String department,
                                           BigDecimal baseSalary) {
        if (user == null) return;
        if (empRepo.findByUserId(user.getId()).isPresent()) {
            return; // already has an employee profile
        }
                    Employee emp = new Employee();
                    emp.setUser(user);
                    emp.setFirstName(firstName);
                    emp.setLastName(lastName);
                    emp.setDob(dob);
                    emp.setPhone(phone);
                    emp.setAddress(address);
                    emp.setDesignation(designation);
                    emp.setDepartment(department);
                    emp.setBaseSalary(baseSalary);
                    empRepo.save(emp);
                }
        
    
}
