package com.example.security;

import java.time.Instant;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TokenBlacklistService {

    private final Map<String, Instant> revoked = new ConcurrentHashMap<>();

    public void blacklist(String token, Instant expiresAt) {
        // If exp is null (shouldn’t happen with valid tokens), keep for a short time
        revoked.put(token, expiresAt != null ? expiresAt : Instant.now().plusSeconds(3600));
    }

    public boolean isBlacklisted(String token) {
        Instant exp = revoked.get(token);
        if (exp == null) return false;
        if (exp.isAfter(Instant.now())) return true;
        // expired entry → cleanup
        revoked.remove(token);
        return false;
    }

    /** Periodic cleanup of expired entries. Runs every 5 minutes. */
    @Scheduled(fixedDelay = 5 * 60 * 1000L)
    public void cleanup() {
        Instant now = Instant.now();
        Iterator<Map.Entry<String, Instant>> it = revoked.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, Instant> e = it.next();
            if (e.getValue() == null || !e.getValue().isAfter(now)) {
                it.remove();
            }
        }
    }
}
