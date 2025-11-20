package com.oli.mada.config;

import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Clé secrète (tu peux en générer une plus longue)
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Génère un token valide 24h
    public String generateToken(String username, Long roleId) {
        JwtBuilder builder = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000));

        if (roleId != null) {
            builder.claim("roleId", roleId);
        }

        return builder.signWith(key).compact();
    }

    // TODO: Parser le token (on le fera après)
}
