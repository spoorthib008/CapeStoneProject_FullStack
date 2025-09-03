package com.example.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.Employee;
import com.example.entity.User;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
	Optional<Employee> findByUserId(Long userId);
	
	 boolean existsByUserId(Long userId);

}
