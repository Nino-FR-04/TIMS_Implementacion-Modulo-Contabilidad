package org.contabilidad.dto;

import lombok.Data;

/**
 * Objeto de transferencia de datos utilizado
 * para recibir las credenciales de autenticación
 * enviadas por el usuario.
 *
 * Contiene la información necesaria para iniciar
 * sesión dentro del sistema.
 *
 * Se utiliza para transportar los datos de acceso
 * entre el cliente y las capas internas de la aplicación.
 */
@Data
public class LoginRequest {

    /**
     * Correo electrónico del usuario.
     */
    private String email;

    /**
     * Contraseña asociada a la cuenta.
     */
    private String password;
}
