package com.example.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.Employee;
import com.example.entity.LeaveRequest;
import com.example.entity.LeaveStatus;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployee(Employee e);
    List<LeaveRequest> findByStatus(LeaveStatus status);

    boolean existsByEmployeeAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Employee employee, LeaveStatus status, LocalDate startDate, LocalDate endDate);
    void deleteByEmployee(Employee employee);

}
