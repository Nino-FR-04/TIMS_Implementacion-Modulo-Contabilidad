package org.contabilidad.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private boolean response;
    private String mensaje;
    private String nombre;
    private String rol;

    public LoginResponse(
            boolean response,
            String mensaje,
            String nombre,
            String rol
    ){
        this.response = response;
        this.mensaje = mensaje;
        this.nombre = nombre;
        this.rol = rol;
    }
}
