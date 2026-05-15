package org.contabilidad.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_asiento")
@Data
@NoArgsConstructor
public class DetalleAsiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asiento_id", nullable = false)
    private Asiento asiento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cuenta_id", nullable = false)
    private Cuenta cuenta;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal debito = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal credito = BigDecimal.ZERO;
}
