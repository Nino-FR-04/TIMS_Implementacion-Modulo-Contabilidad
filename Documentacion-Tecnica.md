# Documentación Técnica — Módulo de Contabilidad

---

## 1. Datos Generales

**Curso:** Laboratorio de Testing, Implantación y Mantenimiento de Sistemas  
**Docente:** Ing. Christian Alain Revilla Arroyo.  
**Sesión:** 08 — Guerra de los Testers  
**Universidad:** Universidad Católica de Santa María  

---

## 2. Arquitectura del sistema

| Tecnología | Puerto |
|--|--|
| React | 5173 |
| Spring Boot | 8080 |
| MySQL (Docker) | 3310 |

El frontend consume la API REST del backend mediante Axios.
La comunicación es JSON sobre HTTP.
CORS está configurado para permitir peticiones desde `localhost:5173`.

---

## 3. Modelo de base de datos

### Tabla: cuentas
| Columna | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| codigo | VARCHAR(20) UNIQUE | Código de la cuenta |
| nombre | VARCHAR(150) | Nombre descriptivo |
| tipo | ENUM | ACTIVO, PASIVO, PATRIMONIO, INGRESO, GASTO |
| activa | BOOLEAN | Estado de la cuenta |

### Tabla: asientos
| Columna | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| fecha | DATE | Fecha del asiento |
| descripcion | VARCHAR(255) | Glosa o descripción |
| creado_en | TIMESTAMP | Fecha de registro |

### Tabla: detalle_asiento
| Columna | Tipo | Descripción |
|---|---|---|
| id | BIGINT PK | Identificador único |
| asiento_id | BIGINT FK | Referencia al asiento |
| cuenta_id | BIGINT FK | Referencia a la cuenta |
| debito | DECIMAL(15,2) | Monto al debe |
| credito | DECIMAL(15,2) | Monto al haber |

### Relaciones
- Un `asiento` tiene muchos `detalle_asiento` (1:N)
- Un `detalle_asiento` pertenece a una `cuenta` (N:1)

---

## 4. Funcionalidades implementadas

### 4.1 Autenticación
- Login con email y contraseña (Implementacion basica)
- Dos roles: ADMIN y CONTADOR

### 4.2 Plan de cuentas
- Listar todas las cuentas
- Crear cuenta (código único obligatorio)
- Editar nombre y tipo de cuenta
- Eliminar cuenta (solo si no tiene movimientos)
- Tipos: ACTIVO, PASIVO, PATRIMONIO, INGRESO, GASTO

### 4.3 Asientos contables
- Registrar asiento con fecha y descripción
- Agregar múltiples líneas de débito y crédito
- Validación automática: total débitos = total créditos
- Mínimo 2 líneas por asiento
- Eliminar asiento (elimina detalles en cascada)

### 4.4 Libro diario
- Listar todos los asientos con sus detalles
- Filtrar por rango de fechas

---

## 5. Validaciones implementadas

| Validación | Capa |
|---|---|
| Código de cuenta vacío | Service |
| Nombre de cuenta vacío | Service |
| Código duplicado | Service |
| Cuenta con movimientos | Service |
| Menos de 2 líneas | Service |
| Débitos = 0 | Service |
| Asiento desbalanceado | Service |
| Línea sin cuenta | Service |
| Fecha inicio > fecha fin | Service |

---

## 6. Casos de prueba implementados (JUnit)

| N° | Caso | Resultado esperado |
|---|---|---|
| 1 | Crear asiento balanceado | Se guarda correctamente |
| 2 | Crear asiento desbalanceado | Lanza IllegalArgumentException |
| 3 | Crear asiento con menos de 2 líneas | Lanza IllegalArgumentException |
| 4 | Eliminar cuenta con movimientos | Lanza IllegalStateException |

---

## 7. Instrucciones para el equipo tester

### Casos críticos a probar

**Cuentas:**
- Crear cuenta con código duplicado - debe rechazarse
- Crear cuenta con campos vacíos - debe rechazarse
- Eliminar cuenta con asientos registrados - debe rechazarse

**Asientos:**
- Registrar asiento donde débitos ≠ créditos - debe rechazarse
- Registrar asiento con menos de 2 líneas - debe rechazarse
- Registrar asiento con cuenta inexistente - debe rechazarse
- Registrar asiento con monto 0 - debe rechazarse

**Filtros:**
- Filtrar diario con fecha inicio mayor a fecha fin - debe rechazarse

### Herramientas sugeridas para testing
- **Postman** — pruebas de API REST
- **JUnit 5** — pruebas unitarias de servicios
- **Navegador** — pruebas funcionales del frontend

---

## 8. Limitaciones conocidas

- La contraseña no está encriptada y la funcionalidad autenticacion es muy simple.
- No se implementó exportación a PDF
- No se implementaron períodos contables cerrados
- El login no usa JWT
