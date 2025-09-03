package com.example.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
public class AuthRequest {
	
	@NotBlank
	private String username;
	
	@NotBlank
	private String password;
	
	public AuthRequest() {}

    public AuthRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Explicit getters/setters (no Lombok required)
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

}
