package org.contabilidad.controller;

import lombok.RequiredArgsConstructor;
import org.contabilidad.dto.AsientoDTO;
import org.contabilidad.service.AsientoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

/**
 * Controlador encargado de gestionar las solicitudes HTTP
 * relacionadas con los asientos contables.
 *
 * Proporciona endpoints para consultar, registrar
 * y eliminar asientos dentro del sistema.
 *
 * Actúa como intermediario entre el cliente
 * y la capa de servicios.
 */
@RestController
@RequestMapping("/api/asientos")
@RequiredArgsConstructor
public class AsientoController {

    //Servicio - Encargado de la logica de negocio
    private final AsientoService asientoService;

    /**
     * Obtiene todos los asientos registrados o filtra
     * los resultados mediante un rango de fechas.
     *
     * @param desde fecha inicial del filtro
     * @param hasta fecha final del filtro
     * @return {@code ResponseEntity} - respuesta con la lista de asientos
     * o mensaje de error en caso de excepción
     */
    @GetMapping
    public ResponseEntity<?> listarAsientos(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate desde,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate hasta
            ) {

        try {
            return (desde != null && hasta != null) ?
                    ResponseEntity.ok(this.asientoService.listarPorFecha(desde,hasta)):
                    ResponseEntity.ok(this.asientoService.listarAsientos());
        }catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Registra un nuevo asiento contable.
     *
     * @param req datos del asiento a registrar
     * @return {@code ResponseEntity} - respuesta con el asiento creado
     * o mensaje de error si ocurre una validación
     */
    @PostMapping
    public ResponseEntity<?> crearAsiento(@RequestBody AsientoDTO req) {
        try {
            return ResponseEntity.ok(this.asientoService.crearAsiento(req));
        }catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Elimina un asiento existente según su identificador.
     *
     * @param id identificador del asiento
     * @return {@code ResponseEntity} - mensaje de confirmación o error
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAsiento(@PathVariable Long id) {
        try {
            this.asientoService.eliminarAsiento(id);
            return ResponseEntity.ok("Asiento eliminado correctamente");
        }catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
