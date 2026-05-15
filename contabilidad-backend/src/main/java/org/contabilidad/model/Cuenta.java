package org.contabilidad.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cuentas")
@Data
@NoArgsConstructor
public class Cuenta {
    //Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCuenta tipo;

    @Column(nullable = false)
    private Boolean activa = true;

    public enum TipoCuenta {
        ACTIVO,
        PASIVO,
        PATRIMONIO,
        INGRESO,
        GASTO
    }
}
