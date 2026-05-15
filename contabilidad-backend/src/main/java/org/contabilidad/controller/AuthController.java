package org.contabilidad.controller;

import org.contabilidad.dto.LoginRequest;
import org.contabilidad.dto.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    //Usuarios por defecto
    String[][] correos_Emails = {
            {"admin@empresa.com","admin12345"},
            {"contador@empresa.com","contador12345"}
    };

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        if(this.correos_Emails[0][0].equals(req.getEmail()) &&
                this.correos_Emails[0][1].equals(req.getPassword())) {
            return ResponseEntity.ok(
                    new LoginResponse(
                            true,
                            "Login exitoso",
                            "Administrador",
                            "ADMINISTRADOR"
                    )
            );
        }

        if(this.correos_Emails[1][0].equals(req.getEmail()) &&
                this.correos_Emails[1][1].equals(req.getPassword())) {
            return ResponseEntity.ok(
                    new LoginResponse(
                            true,
                            "Login exitoso",
                            "Contador",
                            "CONTADOR"
                    )
            );
        }

        return ResponseEntity.status(401).body(
                new LoginResponse(
                        false,
                        "Credenciales incorrectas",
                        null,
                        null
                )
        );
    }
}
