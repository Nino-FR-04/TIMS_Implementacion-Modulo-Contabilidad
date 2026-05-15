package org.contabilidad.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.contabilidad.dto.AsientoDTO;
import org.contabilidad.dto.DetalleDTO;
import org.contabilidad.model.Asiento;
import org.contabilidad.model.Cuenta;
import org.contabilidad.model.DetalleAsiento;
import org.contabilidad.repository.AsientoRepository;
import org.contabilidad.repository.CuentaRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Servicio encargado de gestionar la lógica de negocio
 * relacionada con los asientos contables.
 *
 * Utiliza transacciones para garantizar la integridad
 * de los datos durante operaciones de escritura.
 *
 */
@Service
@RequiredArgsConstructor
public class AsientoService {

    private final AsientoRepository asientoRepository;
    private final CuentaRepository cuentaRepository;

    /**
     * Obtiene todos los asientos registrados
     * junto con sus detalles asociados.
     *
     * @return {@code List<Asiento>} - lista de asientos contables
     */
    public List<Asiento> listarAsientos() {
        return this.asientoRepository.findAllConDetalles();
    }

    /**
     * Obtiene los asientos registrados dentro
     * de un rango de fechas.
     *
     * @param desde fecha inicial de búsqueda
     * @param hasta fecha final de búsqueda
     * @return {@code List<Asiento>} - lista de asientos encontrados
     * @throws IllegalArgumentException si la fecha
     * inicial es mayor que la fecha final
     */
    public List<Asiento> listarPorFecha(LocalDate desde, LocalDate hasta) {
        if(desde.isAfter(hasta))
            throw new IllegalArgumentException("La fecha de inicio no puede ser mayor a la fecha de fin");

        return this.asientoRepository.findByFechaBetween(desde,hasta);
    }

    /**
     * Crea un nuevo asiento contable validando
     * las reglas de negocio antes de almacenarlo.
     *
     * @param asientodto información del asiento a registrar
     * @return {@code Asiento} - asiento creado y almacenado
     * @throws IllegalArgumentException si alguna validación falla
     */
    @Transactional
    public Asiento crearAsiento(AsientoDTO asientodto) {
        if(asientodto.getFecha() == null)
            throw new IllegalArgumentException("la fecha es un campo obligatorio");

        if(asientodto.getDescripcion() == null || asientodto.getDescripcion().isBlank())
            throw new IllegalArgumentException("La descripcion es un campo obligatorio");

        if (asientodto.getDetalles() == null || asientodto.getDetalles().size() < 2)
            throw new IllegalArgumentException("El asiento debe tener al menos 2 líneas.");

        BigDecimal totalDebito = asientodto.getDetalles().stream()
                .map( d -> d.getDebito() != null ? d.getDebito():BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCredito = asientodto.getDetalles().stream()
                .map(d -> d.getCredito() != null ? d.getCredito() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if(totalDebito.compareTo(BigDecimal.ZERO) == 0)
            throw new IllegalArgumentException("El total de debitos no puede ser cero");

        if (totalDebito.compareTo(totalCredito) != 0)
            throw new IllegalArgumentException(
                    "Asiento desbalanceado. Débitos: " + totalDebito + " — Créditos: " + totalCredito
            );

        Asiento asiento = new Asiento();
        asiento.setFecha(asientodto.getFecha());
        asiento.setDescripcion(asientodto.getDescripcion().trim());

        for(DetalleDTO det : asientodto.getDetalles()) {
            if(det.getCuentaId() == null)
                throw new IllegalArgumentException("Cada linea debe de tener una cuenta asignada");

            Cuenta cuenta = this.cuentaRepository.findById(det.getCuentaId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Cuenta no encontrada: " + det.getCuentaId()
                    ));

            DetalleAsiento detalle = new DetalleAsiento();
            detalle.setAsiento(asiento);
            detalle.setCuenta(cuenta);
            det.setDebito(det.getDebito()  != null ? det.getDebito()  : BigDecimal.ZERO);
            det.setCredito(det.getCredito() != null ? det.getCredito() : BigDecimal.ZERO);
            asiento.getDetalles().add(detalle);
        }
        return this.asientoRepository.save(asiento);
    }

    /**
     * Elimina un asiento contable por su identificador.
     *
     * @param id identificador del asiento
     * @throws IllegalArgumentException si el asiento no existe
     */
    @Transactional
    public void eliminarAsiento(Long id) {
        if(!this.asientoRepository.existsById(id))
            throw new IllegalArgumentException("Asiento no encontrado");

        this.asientoRepository.deleteById(id);
    }
}
