# TIMS_Implementacion-Modulo-Contabilidad

Implementación de un Modulo de contabilidad.

Desarrollado para el curso **Laboratorio de Testing, Implantacion y Mantenimiento de Sistemas** — UCSM.

---

## Integrantes

| Codigo | Nombre |
|---|---|
| 2023221531 | Condori Ttito Jesus Gustavo |
| 2023222281 | Flores Rodriguez Nino David |
| 2022402291 | Zuñiga Quiroz Rodrigo Daniel |

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Java 17 y Spring Boot 3 |
| Base de datos | MySQL 8 (Docker) |
| Frontend | React y Vite |
| Build | Gradle (Kotlin DSL) |
| Testing | JUnit 5 |
| Control de versiones | Git y GitHub |

---

## Requisitos previos

Debes de tener instalado:

- [Java 17+](https://adoptium.net/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 18+](https://nodejs.org/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Nino-FR-04/TIMS_Implementacion-Modulo-Contabilidad.git
cd TIMS_Implementacion-Modulo-Contabilidad
```

### 2. Levantar la base de datos con Docker

```bash
docker compose up -d
```

Verifica que el contenedor esté corriendo:

```bash
docker ps
```

### 3. Arrancar el backend

Abrir el proyecto (contabilidad-backend) en IntelliJ y correr la clase principal (Main)

El servidor queda disponible en: `http://localhost:8080`

### 4. Instalar dependencias del frontend

```bash
cd contabilidad-frontend
npm install
```

### 5. Arrancar el frontend

```bash
npm run dev
```

La aplicación queda disponible en: `http://localhost:5173`

---

## Usuarios de prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@empresa.com | admin12345 | ADMINISTRADOR |
| contador@empresa.com | contador12345 | CONTADOR |

---

## Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Login |
| GET | `/api/cuentas` | Listar cuentas |
| POST | `/api/cuentas` | Crear cuenta |
| PUT | `/api/cuentas/{id}` | Editar cuenta |
| DELETE | `/api/cuentas/{id}` | Eliminar cuenta |
| GET | `/api/asientos` | Libro diario |
| GET | `/api/asientos?desde=&hasta=` | Diario filtrado por fecha |
| POST | `/api/asientos` | Registrar asiento |
| DELETE | `/api/asientos/{id}` | Eliminar asiento |
