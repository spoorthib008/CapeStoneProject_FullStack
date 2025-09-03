package com.example.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService blacklist;

    @Autowired
    public JwtAuthFilter(JwtService jwtService,
                         UserDetailsService userDetailsService,
                         TokenBlacklistService blacklist) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.blacklist = blacklist;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // If there is no Bearer token, just continue the chain
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        // 1) Block if this token was explicitly logged out (blacklisted)
        if (blacklist.isBlacklisted(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String username = null;
        try {
            // 2) Validate signature/expiry
            if (jwtService.isValid(token)) {
                username = jwtService.extractUsername(token);
            }
        } catch (Exception e) {
            // Any parsing/validation problem → continue without authentication
            filterChain.doFilter(request, response);
            return;
        }

        // 3) If valid and no auth yet, set authentication
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails user = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    // Skip filter for public endpoints (Swagger + Auth + error)
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String p = request.getServletPath();
        return p.startsWith("/swagger-ui")
                || p.startsWith("/v3/api-docs")
                || "/swagger-ui.html".equals(p)
                || "/api/v1/auth/login".equals(p)
                || "/api/v1/auth/register".equals(p)
                || "/error".equals(p);
    }
}
	


