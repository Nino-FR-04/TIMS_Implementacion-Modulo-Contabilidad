package org.contabilidad.controller;

import lombok.RequiredArgsConstructor;
import org.contabilidad.dto.CuentaDTO;
import org.contabilidad.model.Cuenta;
import org.contabilidad.service.CuentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuentas")
@RequiredArgsConstructor
public class CuentaController {
    private final CuentaService cuentaService;

    @GetMapping
    public List<Cuenta> listarCuentas() {
        return this.cuentaService.listarCuentas();
    }

    @PostMapping
    public ResponseEntity<?> crearCuenta(@RequestBody CuentaDTO req) {
        try {
            return ResponseEntity.ok(this.cuentaService.crearCuenta(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarCuenta(@PathVariable Long id, @RequestBody CuentaDTO req) {
        try {
            return ResponseEntity.ok(
                    this.cuentaService.editarCuenta(id, req)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    e.getMessage()
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCuenta(@PathVariable Long id) {
        try {
            this.cuentaService.eliminarCuenta(id);
            return ResponseEntity.ok(
                    "Cuenta eliminada correctamente"
            );
        }catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
