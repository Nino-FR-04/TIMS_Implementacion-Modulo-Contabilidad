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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AsientoService {

    private final AsientoRepository asientoRepository;
    private final CuentaRepository cuentaRepository;

    public List<Asiento> listarAsientos() {
        return this.asientoRepository.findAllConDetalles();
    }

    public List<Asiento> listarPorFecha(LocalDate desde, LocalDate hasta) {
        if(desde.isAfter(hasta))
            throw new IllegalArgumentException("La fecha de inicio no puede ser mayor a la fecha de fin");

        return this.asientoRepository.findByFechaBetween(desde,hasta);
    }

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
        asiento.setFecha(asiento.getFecha());
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
;        }
        return this.asientoRepository.save(asiento);
    }

    @Transactional
    public void eliminarAsiento(Long id) {
        if(!this.asientoRepository.existsById(id))
            throw new IllegalArgumentException("Asiento no encontrado");

        this.asientoRepository.deleteById(id);
    }
}
