package org.contabilidad.dto;

import lombok.Data;
import org.contabilidad.model.Cuenta;

/**
 * Objeto de transferencia de datos utilizado
 * para registrar o enviar información relacionada
 * con una cuenta contable.
 *
 * Contiene los datos necesarios para crear o
 * actualizar cuentas dentro del sistema.
 *
 * Se utiliza para intercambiar información entre
 * las capas de la aplicación evitando exponer
 * directamente la entidad Cuenta.
 */
@Data
public class CuentaDTO {
    private String codigo;
    private String nombre;
    private Cuenta.TipoCuenta tipo;
}