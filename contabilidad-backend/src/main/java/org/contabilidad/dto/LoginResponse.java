package org.contabilidad.dto;

import lombok.Data;

/**
 * Objeto de transferencia de datos utilizado
 * para enviar la respuesta del proceso de autenticación.
 *
 * Contiene información sobre el resultado del inicio
 * de sesión, incluyendo el estado de la operación,
 * mensaje descriptivo y datos básicos del usuario.
 *
 * Se utiliza para comunicar al cliente si el acceso
 * fue exitoso o si ocurrió algún error.
 */
@Data
public class LoginResponse {
    //Atributos
    private boolean response;
    private String mensaje;
    private String nombre;
    private String rol;

    /**
     * Constructor para inicializar la respuesta
     * del proceso de autenticación.
     *
     * @param response estado de la operación
     * @param mensaje mensaje descriptivo
     * @param nombre nombre del usuario
     * @param rol rol asignado
     */
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