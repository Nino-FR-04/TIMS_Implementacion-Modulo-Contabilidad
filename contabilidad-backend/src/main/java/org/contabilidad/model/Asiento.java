package org.contabilidad.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


/**
 * Entidad que representa un asiento contable dentro del sistema.
 *
 * Un asiento registra una operación financiera realizada en una fecha
 * determinada y contiene una descripción junto con una lista de detalles
 * asociados que representan los movimientos contables.
 *
 * La relación con DetalleAsiento es de uno a muchos, permitiendo que
 * un asiento tenga múltiples registros de movimientos.
 *
 */
@Entity
@Table(name = "asientos")
@Data
@NoArgsConstructor
public class Asiento {
    //Atributos
    /**
     * Identificador único del asiento
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Fecha en la que se registra el asiento contable
     */
    @Column(nullable = false)
    private LocalDate fecha;

    /**
     * Descripción o detalle general de la operación registrada
     */
    @Column(nullable = false, length = 255)
    private String descripcion;

    /**
     * Fecha y hora de creación automática del registro
     */
    @Column(name = "creado_en")
    private LocalDateTime creadoEn = LocalDateTime.now();

    /**
     * Lista de detalles asociados al asiento contable.
     *
     * La relación permite almacenar múltiples movimientos
     * contables vinculados a un mismo asiento
     */
    @OneToMany(mappedBy = "asiento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleAsiento> detalles = new ArrayList<>();
}
