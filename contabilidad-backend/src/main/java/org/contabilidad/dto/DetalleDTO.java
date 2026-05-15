package org.contabilidad.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * Objeto de transferencia de datos utilizado
 * para representar el detalle de un asiento contable.
 *
 * Contiene la información necesaria para asociar
 * una cuenta contable y registrar los valores
 * correspondientes al débito y crédito.
 *
 * Se utiliza para intercambiar información entre
 * las capas de la aplicación evitando exponer
 * directamente la entidad DetalleAsiento.
 */
@Data
public class DetalleDTO {
    private Long cuentaId;
    private BigDecimal debito;
    private BigDecimal credito;
}
