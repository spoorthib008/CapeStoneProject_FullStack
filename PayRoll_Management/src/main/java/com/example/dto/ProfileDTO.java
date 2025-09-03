package com.example.dto;

import lombok.*;

@Getter @Setter
public class ProfileDTO {
	 private String phone;
	    private String address;
	    private String designation;
	    private String department;
	    
	    public ProfileDTO() { }

	    public ProfileDTO(String phone, String address, String designation, String department) {
	        this.phone = phone;
	        this.address = address;
	        this.designation = designation;
	        this.department = department;
	    }

	    // --- GETTERS ---
	    public String getPhone() { return phone; }
	    public String getAddress() { return address; }
	    public String getDesignation() { return designation; }
	    public String getDepartment() { return department; }

	    // --- SETTERS ---
	    public void setPhone(String phone) { this.phone = phone; }
	    public void setAddress(String address) { this.address = address; }
	    public void setDesignation(String designation) { this.designation = designation; }
	    public void setDepartment(String department) { this.department = department; }
	

}
