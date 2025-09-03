package com.example.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity 
@Table(name="users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique=true, nullable=false)
	@NotBlank(message="user name is required")
	private String username;
	
	@Column(nullable=false) 
	@NotBlank
	private String password;
	
	@Email
	@NotBlank
	private String email;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	private Role role;
	
	private boolean enabled = true;
	
	public User() { }

    public User(Long id, String username, String password, String email, Role role, boolean enabled) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
    }

    // ---- Getters ----
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public boolean isEnabled() { return enabled; }

    // ---- Setters ----
    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(Role role) { this.role = role; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}
	
	
    

