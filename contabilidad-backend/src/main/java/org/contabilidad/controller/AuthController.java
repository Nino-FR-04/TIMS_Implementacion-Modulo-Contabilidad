package org.contabilidad.controller;

import org.contabilidad.dto.LoginRequest;
import org.contabilidad.dto.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador encargado de gestionar las solicitudes
 * relacionadas con la autenticación de usuarios.
 *
 * Actúa como intermediario entre el cliente
 * y el proceso de autenticación.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    //Usuarios por defecto
    protected String[][] correos_passw = {
            {"admin@empresa.com","admin12345"},
            {"contador@empresa.com","contador12345"}
    };

    /**
     * Valida las credenciales enviadas
     * por el usuario para iniciar sesión.
     *
     * Si las credenciales son correctas,
     * retorna información del usuario
     * y el rol correspondiente.
     *
     * @param req credenciales enviadas por el usuario
     * @return respuesta del proceso de autenticación
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        if(this.correos_passw[0][0].equals(req.getEmail()) &&
                this.correos_passw[0][1].equals(req.getPassword())) {
            return ResponseEntity.ok(
                    new LoginResponse(
                            true,
                            "Login exitoso",
                            "Administrador",
                            "ADMINISTRADOR"
                    )
            );
        }

        if(this.correos_passw[1][0].equals(req.getEmail()) &&
                this.correos_passw[1][1].equals(req.getPassword())) {
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
