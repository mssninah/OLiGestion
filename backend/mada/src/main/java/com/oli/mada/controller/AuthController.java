package com.oli.mada.controller;

import com.oli.mada.entity.User;
import com.oli.mada.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // autorise React à appeler ton backend
public class AuthController {

    @Autowired
    private AuthService authService;

    // DTO interne pour recevoir le JSON du login
    public static class LoginRequest {
        public String username;
        public String password;
    }

    public record LoginResponse(boolean success, String token, String message) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
         System.out.println(">>> login called with " + request.username);

        String token = authService.login(request.username, request.password);

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, null, "Identifiants incorrects"));
        }

        return ResponseEntity.ok(new LoginResponse(true, token, "Connexion réussie"));
    }

}
