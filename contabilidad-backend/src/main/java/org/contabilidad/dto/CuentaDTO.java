package org.contabilidad.dto;

import lombok.Data;
import org.contabilidad.model.Cuenta;

@Data
public class CuentaDTO {
    private String codigo;
    private String nombre;
    private Cuenta.TipoCuenta tipo;
}
