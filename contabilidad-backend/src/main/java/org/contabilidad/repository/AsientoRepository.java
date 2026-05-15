package org.contabilidad.repository;

import org.contabilidad.model.Asiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

/**
 * Repositorio encargado de gestionar el acceso a los datos
 * relacionados con la entidad Asiento.
 *
 * Extiende JpaRepository para proporcionar operaciones CRUD
 * básicas y consultas personalizadas sobre los asientos
 * contables.
 */
public interface AsientoRepository
        extends JpaRepository<Asiento,Long> {

    /**
     * Obtiene todos los asientos contables junto con sus
     * detalles y cuentas asociadas.
     *
     * @return {@code List<Asiento>}: lista de asientos con sus detalles y cuentas
     */
    @Query("SELECT a FROM Asiento a " +
            "LEFT JOIN FETCH a.detalles d " +
            "LEFT JOIN FETCH d.cuenta " +
            "ORDER BY a.fecha DESC")
    List<Asiento> findAllConDetalles();

    /**
     * Obtiene los asientos registrados dentro de un
     * rango de fechas específico incluyendo sus detalles
     * y cuentas asociadas.
     *
     * @param desde fecha inicial de búsqueda
     * @param hasta fecha final de búsqueda
     * @return {@code List<Asiento>}: lista de asientos encontrados en el rango indicado
     */
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