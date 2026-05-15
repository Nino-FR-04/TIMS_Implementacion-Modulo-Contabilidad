package org.contabilidad.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * Entidad que representa el detalle de un asiento contable.
 *
 * Cada detalle almacena un movimiento específico asociado a una
 * cuenta contable dentro de un asiento, registrando valores
 * de débito y crédito.
 *
 * Un asiento puede contener múltiples detalles y cada detalle
 * se encuentra vinculado a una única cuenta.
 */
@Entity
@Table(name = "detalle_asiento")
@Data
@NoArgsConstructor
public class DetalleAsiento {
    //Atributos
    /**
     * Identificador único del detalle del asiento.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Asiento contable al que pertenece el detalle.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asiento_id", nullable = false)
    private Asiento asiento;

    /**
     * Cuenta contable asociada al movimiento.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cuenta_id", nullable = false)
    private Cuenta cuenta;

    /**
     * Monto registrado en el débito.
     */
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal debito = BigDecimal.ZERO;

    /**
     * Monto registrado en el crédito.
     */
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal credito = BigDecimal.ZERO;
}
