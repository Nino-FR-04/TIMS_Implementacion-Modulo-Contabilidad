package org.contabilidad.controller;

import lombok.RequiredArgsConstructor;
import org.contabilidad.dto.AsientoDTO;
import org.contabilidad.service.AsientoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/asientos")
@RequiredArgsConstructor
public class AsientoController {

    private final AsientoService asientoService;

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

    @PostMapping
    public ResponseEntity<?> crearAsiento(@RequestBody AsientoDTO req) {
        try {
            return ResponseEntity.ok(this.asientoService.crearAsiento(req));
        }catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

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
