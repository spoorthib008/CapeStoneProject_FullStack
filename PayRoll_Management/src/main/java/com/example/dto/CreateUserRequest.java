package com.example.dto;

import com.example.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateUserRequest {
	 @NotBlank private String username;
	    @NotBlank private String password;
	    @Email @NotBlank private String email;
	    @NotNull private Role role;     // ADMIN or EMPLOYEE
	    private boolean enabled = true;

	    public CreateUserRequest() {}

	    public String getUsername() { return username; }
	    public void setUsername(String username) { this.username = username; }
	    public String getPassword() { return password; }
	    public void setPassword(String password) { this.password = password; }
	    public String getEmail() { return email; }
	    public void setEmail(String email) { this.email = email; }
	    public Role getRole() { return role; }
	    public void setRole(Role role) { this.role = role; }
	    public boolean isEnabled() { return enabled; }
	    public void setEnabled(boolean enabled) { this.enabled = enabled; }

}
