package com.example.security;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.entity.User;
import com.example.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepo;

    // Constructor injection (no Lombok, no @Autowired needed on single constructor)
    public CustomUserDetailsService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // IMPORTANT: hasRole('ADMIN') expects authority "ROLE_ADMIN"
        List<GrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()));

        return new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(),
                u.isEnabled(),   // enabled
                true,            // accountNonExpired
                true,            // credentialsNonExpired
                true,            // accountNonLocked
                authorities
        );
    }
}
