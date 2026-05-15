package org.contabilidad.repository;

import org.contabilidad.model.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CuentaRepository
        extends JpaRepository<Cuenta,Long> {

    boolean existsByCodigo(String codigo);
    List<Cuenta> findByActivaTrue();

    @Query("SELECT COUNT(d) " +
            "FROM DetalleAsiento d " +
            "WHERE d.cuenta.id = :cuentaId")
    long contarMovimientos(@Param("cuentaId") Long cuentaId);
}
