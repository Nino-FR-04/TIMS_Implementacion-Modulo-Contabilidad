package org.contabilidad.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa una cuenta contable dentro del sistema.
 *
 * Una cuenta pertenece al plan contable y almacena información
 * como su código, nombre, tipo y estado de actividad.
 *
 * El tipo de cuenta se clasifica según categorías contables
 * como activo, pasivo, patrimonio, ingreso y gasto.
 *
 */
@Entity
@Table(name = "cuentas")
@Data
@NoArgsConstructor
public class Cuenta {
    //Atributos
    /**
     * Identificador único de la cuenta.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Código único asignado a la cuenta contable.
     */
    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    /**
     * Nombre descriptivo de la cuenta.
     */
    @Column(nullable = false, length = 150)
    private String nombre;

    /**
     * Tipo o categoría de la cuenta contable.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCuenta tipo;

    /**
     * Indica si la cuenta se encuentra activa.
     */
    @Column(nullable = false)
    private Boolean activa = true;

    /**
     * Enumeración que define los tipos de cuentas
     * disponibles en el sistema contable.
     */
    public enum TipoCuenta {
        ACTIVO,
        PASIVO,
        PATRIMONIO,
        INGRESO,
        GASTO
    }
}
