package org.contabilidad.service;

import lombok.RequiredArgsConstructor;
import org.contabilidad.dto.CuentaDTO;
import org.contabilidad.model.Cuenta;
import org.contabilidad.repository.CuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CuentaService {

    private final CuentaRepository cuentaRepository;

    public List<Cuenta> listarCuentas() {
        return this.cuentaRepository.findAll();
    }

    public Cuenta crearCuenta(CuentaDTO cuentadto) {
        if(cuentadto.getCodigo() == null || cuentadto.getCodigo().isBlank())
            throw new IllegalArgumentException("El codigo no puede estar vacio");

        if(cuentadto.getNombre() == null || cuentadto.getNombre().isBlank())
            throw  new IllegalArgumentException("El nombre no puede estar vacio");

        if(this.cuentaRepository.existsByCodigo(cuentadto.getCodigo()))
            throw new IllegalArgumentException("Ya existe una cuenta con el codigo: " + cuentadto.getCodigo());

        Cuenta cuenta = new Cuenta();
        cuenta.setCodigo(cuentadto.getCodigo().trim());
        cuenta.setNombre(cuentadto.getNombre().trim());
        cuenta.setTipo(cuentadto.getTipo());

        return this.cuentaRepository.save(cuenta);
    }

    public Cuenta editarCuenta(Long id, CuentaDTO cuentadto) {
        Cuenta cuenta = this.cuentaRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Cuenta no encontrada: " + id)
        );

        if(cuentadto.getNombre() == null || cuentadto.getNombre().isBlank())
            throw new IllegalArgumentException("El nombre no puede estar vacio");

        cuenta.setNombre(cuentadto.getNombre());
        cuenta.setTipo(cuentadto.getTipo());

        return this.cuentaRepository.save(cuenta);
    }

    public void eliminarCuenta(Long id) {
        if(!this.cuentaRepository.existsById(id))
            throw new IllegalArgumentException("Cuenta no encontrada: " + id);

        if(this.cuentaRepository.contarMovimientos(id) > 0)
            throw new IllegalArgumentException("No se puede eliminar una cuenta con movimientos");

        this.cuentaRepository.deleteById(id);
    }

}
