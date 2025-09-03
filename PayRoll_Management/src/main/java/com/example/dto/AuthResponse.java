package com.example.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class AuthResponse {
	
	
	private String accessToken;
	private Long userId;
	private String username;
	private String role;
	
	public AuthResponse() {}

    public AuthResponse(String accessToken, Long userId, String username, String role) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.username = username;
        this.role = role;
    }

    // Getters (setters optional)
    public String getAccessToken() { return accessToken; }
    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getRole() { return role; }

    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setUsername(String username) { this.username = username; }
    public void setRole(String role) { this.role = role; }

}
