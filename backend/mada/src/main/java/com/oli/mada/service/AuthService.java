package com.oli.mada.service;

import com.oli.mada.config.JwtUtil;
import com.oli.mada.entity.User;
import com.oli.mada.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            return null;
        }

        // Vérifier le hash BCrypt
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return null;
        }

        Long roleId = user.getRole() != null ? user.getRole().getId() : null;
        // Générer le token JWT
        return jwtUtil.generateToken(user.getUsername(), roleId);
    }
}
