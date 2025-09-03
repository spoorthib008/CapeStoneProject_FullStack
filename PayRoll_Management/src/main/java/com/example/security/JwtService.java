package com.example.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.constraints.NotNull;

@Service
public class JwtService {

    private final Key key;
    private final long expiryMinutes;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expiryMinutes}") long expiryMinutes) {
        // Secret must be >= 32 bytes for HS256
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiryMinutes = expiryMinutes;
    }

    public String generateToken(String username, String role) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expiryMinutes * 60);

        return Jwts.builder()
                .subject(username)                         // setSubject() → subject()
                .claims(Map.of("role", role))              // addClaims() → claims()
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(key)                             // in 0.12.x: just pass the Key
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key)               // parserBuilder().setSigningKey(...) → verifyWith(key)
                .build()
                .parseSignedClaims(token)                  // parseClaimsJws() → parseSignedClaims()
                .getPayload()
                .getSubject();
    }

    public String extractRole(String token) {
        Object r = Jwts.parser()
                .verifyWith((SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role");
        return r == null ? null : r.toString();
    }

    public boolean isValid(String token) {
        try {
            Jwts.parser().verifyWith((SecretKey) key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ====== NEW: helpers for logout / diagnostics ======

    /** Returns the token's expiration as Instant, or null if not present or token invalid. */
    public Instant getExpiration(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith((SecretKey) key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            Date exp = claims.getExpiration();
            return exp != null ? exp.toInstant() : null;
        } catch (JwtException ex) {
            return null;
        }
    }

    /** Optional: get all claims (returns null if token invalid). */
    public Claims getClaims(@NotNull String token) {
        try {
            return Jwts.parser()
                    .verifyWith((SecretKey) key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException ex) {
            return null;
        }
    }
}
	 
	


