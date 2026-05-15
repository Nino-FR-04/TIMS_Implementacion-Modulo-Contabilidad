package org.contabilidad.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

/**
 * Objeto de transferencia de datos utilizado
 * para registrar o enviar información relacionada
 * con un asiento contable.
 *
 * Contiene los datos principales del asiento
 * junto con la lista de detalles asociados.
 *
 * Se utiliza para intercambiar información entre
 * las capas de la aplicación evitando exponer
 * directamente la entidad Asiento.
 *
 */
@Data
public class AsientoDTO {
    private LocalDate fecha;
    private String descripcion;
    private List<DetalleDTO> detalles;
}
