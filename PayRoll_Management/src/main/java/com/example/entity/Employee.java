package com.example.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="employees")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {
	
	    @Id 
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @OneToOne(optional=false)
	    @JoinColumn(name="user_id", unique=true)
	    private User user;

	   
	    private String firstName;
	    private String lastName;
	    private LocalDate dob;
	    private String phone;
	    private String address;
	    private String designation;
	    private String department;

	    @Column(precision = 12, scale = 2)
	    private BigDecimal baseSalary;
	    
	    public Employee() {}

	    // (Optional) convenience constructor
	    public Employee(User user, String firstName, String lastName, LocalDate dob,
	                    String phone, String address, String designation,
	                    String department, BigDecimal baseSalary) {
	        this.user = user;
	        this.firstName = firstName;
	        this.lastName = lastName;
	        this.dob = dob;
	        this.phone = phone;
	        this.address = address;
	        this.designation = designation;
	        this.department = department;
	        this.baseSalary = baseSalary;
	    }

	   
	    public Long getId() { return id; }
	    public User getUser() { return user; }
	    public String getFirstName() { return firstName; }
	    public String getLastName() { return lastName; }
	    public LocalDate getDob() { return dob; }
	    public String getPhone() { return phone; }
	    public String getAddress() { return address; }
	    public String getDesignation() { return designation; }
	    public String getDepartment() { return department; }
	    public BigDecimal getBaseSalary() { return baseSalary; }
	    
	    public void setId(Long id) { this.id = id; }
	    public void setUser(User user) { this.user = user; }
	    public void setFirstName(String firstName) { this.firstName = firstName; }
	    public void setLastName(String lastName) { this.lastName = lastName; }
	    public void setDob(LocalDate dob) { this.dob = dob; }
	    public void setPhone(String phone) { this.phone = phone; }
	    public void setAddress(String address) { this.address = address; }
	    public void setDesignation(String designation) { this.designation = designation; }
	    public void setDepartment(String department) { this.department = department; }
	    public void setBaseSalary(BigDecimal baseSalary) { this.baseSalary = baseSalary; }

}
