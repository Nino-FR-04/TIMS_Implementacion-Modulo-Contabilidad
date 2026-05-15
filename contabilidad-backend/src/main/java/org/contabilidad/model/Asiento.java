package org.contabilidad.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "asientos")
@Data
@NoArgsConstructor
public class Asiento {
    //Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Column(name = "creado_en")
    private LocalDateTime creadoEn = LocalDateTime.now();

    @OneToMany(mappedBy = "asiento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleAsiento> detalles = new ArrayList<>();
}
