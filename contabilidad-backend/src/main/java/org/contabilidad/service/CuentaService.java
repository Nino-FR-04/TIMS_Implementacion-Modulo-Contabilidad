package org.contabilidad.service;

import lombok.RequiredArgsConstructor;
import org.contabilidad.dto.CuentaDTO;
import org.contabilidad.model.Cuenta;
import org.contabilidad.repository.CuentaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Servicio encargado de gestionar la lógica de negocio
 * relacionada con las cuentas contables.
 */
@Service
@RequiredArgsConstructor
public class CuentaService {

    private final CuentaRepository cuentaRepository;

    /**
     * Obtiene todas las cuentas registradas.
     *
     * @return {@code List<Cuenta>} - lista de cuentas contables
     */
    public List<Cuenta> listarCuentas() {
        return this.cuentaRepository.findAll();
    }

    /**
     * Registra una nueva cuenta contable
     * realizando validaciones previas.
     *
     * @param cuentadto información de la cuenta a registrar
     * @return {@code Cuenta} - cuenta creada y almacenada
     * @throws IllegalArgumentException si alguna validación falla
     */
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

    /**
     * Actualiza la información de una cuenta existente.
     *
     * @param id identificador de la cuenta
     * @param cuentadto datos actualizados
     * @return {@code Cuenta} - cuenta modificada
     * @throws IllegalArgumentException si la cuenta
     * no existe o el nombre es inválido
     */
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

    /**
     * Elimina una cuenta del sistema.
     *
     * Antes de eliminar se verifica:
     * - Existencia de la cuenta
     * - Que no tenga movimientos asociados
     *
     * @param id identificador de la cuenta
     * @throws IllegalArgumentException si la cuenta
     * no existe o tiene movimientos registrados
     */
    public void eliminarCuenta(Long id) {
        if(!this.cuentaRepository.existsById(id))
            throw new IllegalArgumentException("Cuenta no encontrada: " + id);

        if(this.cuentaRepository.contarMovimientos(id) > 0)
            throw new IllegalArgumentException("No se puede eliminar una cuenta con movimientos");

        this.cuentaRepository.deleteById(id);
    }
}
