package org.contabilidad.repository;

import org.contabilidad.model.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Repositorio encargado de gestionar el acceso a datos
 * relacionados con la entidad Cuenta.
 *
 * Extiende JpaRepository para proporcionar operaciones CRUD
 * básicas y consultas personalizadas sobre las cuentas
 * contables del sistema.
 */
public interface CuentaRepository
        extends JpaRepository<Cuenta,Long> {

    /**
     * Verifica si existe una cuenta con el código especificado.
     *
     * @param codigo código de la cuenta contable
     * @return {@code true} si la cuenta existe, {@code false} en caso contrario
     */
    boolean existsByCodigo(String codigo);

    /**
     * Obtiene únicamente las cuentas activas del sistema.
     *
     * @return {@code List<Cuenta>} lista de cuentas activas
     */
    @Deprecated
    List<Cuenta> findByActivaTrue();

    /**
     * Cuenta la cantidad de movimientos registrados
     * para una cuenta específica.
     *
     * La consulta contabiliza los registros asociados
     * en los detalles de asiento.
     *
     * @param cuentaId identificador de la cuenta
     * @return {@code Long} cantidad de movimientos asociados
     */
    @Query("SELECT COUNT(d) " +
            "FROM DetalleAsiento d " +
            "WHERE d.cuenta.id = :cuentaId")
    long contarMovimientos(@Param("cuentaId") Long cuentaId);
}
