package org.contabilidad.repository;

import org.contabilidad.model.Asiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AsientoRepository
        extends JpaRepository<Asiento,Long> {

    @Query("SELECT a FROM Asiento a " +
            "LEFT JOIN FETCH a.detalles d " +
            "LEFT JOIN FETCH d.cuenta " +
            "ORDER BY a.fecha DESC")
    List<Asiento> findAllConDetalles();

    @Query("SELECT a FROM Asiento a " +
            "LEFT JOIN FETCH a.detalles d " +
            "LEFT JOIN FETCH d.cuenta " +
            "WHERE a.fecha BETWEEN :desde AND :hasta " +
            "ORDER BY a.fecha DESC")
    List<Asiento> findByFechaBetween(
            @Param("desde") LocalDate desde,
            @Param("hasta") LocalDate hasta
    );

}
