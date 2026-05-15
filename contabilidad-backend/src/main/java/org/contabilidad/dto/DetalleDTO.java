package org.contabilidad.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DetalleDTO {
    private Long cuentaId;
    private BigDecimal debito;
    private BigDecimal credito;
}
