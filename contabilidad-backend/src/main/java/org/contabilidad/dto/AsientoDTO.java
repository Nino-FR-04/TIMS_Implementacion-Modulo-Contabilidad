package org.contabilidad.dto;

import lombok.Data;
import org.contabilidad.model.DetalleAsiento;

import java.time.LocalDate;
import java.util.List;

@Data
public class AsientoDTO {
    private LocalDate fecha;
    private String descripcion;
    private List<DetalleDTO> detalles;
}
