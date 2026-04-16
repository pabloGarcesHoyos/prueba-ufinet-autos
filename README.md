# prueba-ufinet-autos

Proyecto full stack para gestión de autos por usuario autenticado. La aplicación permite registrar usuarios, iniciar sesión con JWT y administrar un CRUD de autos protegido, garantizando que cada usuario solo pueda consultar y modificar sus propios registros.

## Descripción General

El proyecto está compuesto por:

- Un backend en Spring Boot con autenticación JWT, seguridad stateless y persistencia en PostgreSQL.
- Un frontend en React + Vite que consume la API REST, gestiona la sesión del usuario y permite operar el CRUD de autos.
- Un script SQL para inicialización de base de datos.
- Una colección de Postman lista para importar y probar la API.

## Stack Tecnológico

### Backend

- Java 21
- Maven
- Spring Boot 3.3.5
- Spring Security
- JWT con `jjwt`
- Spring Data JPA / Hibernate
- PostgreSQL
- Lombok

### Frontend

- React 18
- Vite 5
- Axios
- React Router
- CSS plano

## Arquitectura

El backend está implementado con una **arquitectura por capas**, con separación clara entre entrada HTTP, lógica de aplicación, persistencia, seguridad y contratos de transporte.

### Estructura lógica del backend

- `controller`
  Expone los endpoints REST y delega la lógica a servicios.

- `service/interfaces`
  Define los contratos de aplicación.

- `service/impl`
  Implementa los casos de uso reales del sistema.

- `repository`
  Encapsula el acceso a datos mediante Spring Data JPA.

- `entity`
  Contiene el modelo persistente principal: `User` y `Car`.

- `dto/request` y `dto/response`
  Define los contratos de entrada y salida de la API.

- `security`
  Contiene JWT, filtro de autenticación, configuración de Spring Security y resolución del usuario autenticado.

- `exception`
  Centraliza excepciones personalizadas y manejo global de errores.

### Nota arquitectónica

La solución sigue principios compatibles con puertos y adaptadores, pero técnicamente no se presenta como una hexagonal estricta. El dominio está bien separado a nivel de responsabilidades, aunque aún mantiene integración directa con JPA y Spring Data, lo cual es adecuado para el alcance de esta prueba técnica.

## Estructura del Repositorio

```text
prueba-ufinet-autos/
├── backend/
│   ├── src/
│   └── pom.xml
├── frontend/
│   ├── src/
│   └── package.json
├── database/
│   └── init.sql
├── docs/
│   ├── postman_collection.json
│   └── structure-notes.md
└── README.md
```

## Funcionalidad Implementada

Actualmente el proyecto incluye:

- Registro de usuario
- Inicio de sesión
- Autenticación basada en JWT
- Protección de endpoints privados
- CRUD de autos por usuario autenticado
- Validación de propiedad para que cada usuario solo gestione sus propios autos
- Búsqueda y filtros en frontend
- Campo simulado de foto en frontend
- Diseño responsive básico

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Java 21
- Maven 3.9 o superior
- Node.js 18 o superior
- npm
- PostgreSQL 14 o superior

## Configuración de Base de Datos

La aplicación está configurada para trabajar con PostgreSQL.

Archivo de configuración principal:

- [backend/src/main/resources/application.properties](</C:/Users/user/OneDrive - Cofincafe/Documentos/prueba-ufinet-autos/backend/src/main/resources/application.properties>)

Valores por defecto:

- Base de datos: `prueba_ufinet_autos`
- Host: `localhost`
- Puerto: `5432`
- Usuario: `postgres`
- Contraseña: `postgres`

Propiedades relevantes:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/prueba_ufinet_autos
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
jwt.secret=change-this-jwt-secret-to-a-secure-32-plus-character-value
jwt.expiration=86400000
app.cors.allowed-origins=http://localhost:5173
```

También puedes sobreescribir la conexión por variables de entorno:

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/prueba_ufinet_autos
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

## Inicialización de la Base de Datos

El script SQL está en:

- [database/init.sql](</C:/Users/user/OneDrive - Cofincafe/Documentos/prueba-ufinet-autos/database/init.sql>)

Ese script crea:

- tabla `users`
- tabla `cars`
- restricción única para `email`
- restricción única para `plate_number`
- relación `cars.user_id -> users.id`
- índice para consultas por usuario

Si `createdb` y `psql` no están en el `PATH`, en Windows puedes usar la ruta completa de PostgreSQL.

Ejemplo:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\createdb.exe" -U postgres prueba_ufinet_autos
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d prueba_ufinet_autos -f "C:\ruta\al\proyecto\database\init.sql"
```

Si PostgreSQL ya está en el `PATH`, puedes usar:

```bash
createdb -U postgres prueba_ufinet_autos
psql -U postgres -d prueba_ufinet_autos -f database/init.sql
```

## Ejecución del Backend

Desde la raíz del proyecto:

```bash
cd backend
mvn clean compile -DskipTests
mvn spring-boot:run
```

URL por defecto:

- Backend: `http://localhost:8080`
- Base API: `http://localhost:8080/api`

## Ejecución del Frontend

Desde la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

URL por defecto:

- Frontend: `http://localhost:5173`

## Configuración del Frontend

El frontend consume la API mediante Axios.

Base URL por defecto:

```text
http://localhost:8080/api
```

Se puede sobreescribir con:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

Si necesitas cambiar la URL local, crea un archivo `.env` dentro de `frontend/`.

## Seguridad y Autenticación

La autenticación funciona con JWT y Spring Security.

### Flujo

1. El usuario se registra o inicia sesión.
2. El backend devuelve un token JWT.
3. El frontend guarda el token y los datos básicos del usuario en `localStorage`.
4. Cada request autenticado envía:

```http
Authorization: Bearer <token>
```

5. El backend valida el token en un filtro JWT y resuelve el usuario autenticado.
6. Los endpoints de autos se ejecutan bajo el contexto del usuario autenticado.

### Respuesta de autenticación

La API responde con:

- `token`
- `type`
- `userId`
- `name`
- `email`

## Endpoints Principales

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Cars

- `POST /api/cars`
- `GET /api/cars`
- `GET /api/cars/{id}`
- `PUT /api/cars/{id}`
- `DELETE /api/cars/{id}`

## Flujo Funcional

1. Registrar usuario con `name`, `email` y `password`.
2. Iniciar sesión con `email` y `password`.
3. Recibir JWT desde backend.
4. Acceder a la ruta privada `/cars`.
5. Crear, listar, editar y eliminar autos del usuario autenticado.
6. Filtrar y buscar autos directamente en frontend sin llamadas extra al backend.

## Funcionalidades del Frontend

Además del CRUD base, el frontend incluye:

- Búsqueda en tiempo real por placa o modelo
- Filtros por marca y año
- Limpieza de filtros
- Campo simulado `photoName` para el auto
- Persistencia local del campo visual de foto simulada
- Manejo de errores y estados de carga
- Cierre de sesión automático ante `401`
- Vista responsive para login, register y dashboard de autos

## Consistencia Entre Frontend y Backend

La integración quedó alineada en:

- Rutas bajo `/api`
- Uso de JWT como Bearer token
- Mismos nombres de propiedades para autos:
  - `brand`
  - `model`
  - `year`
  - `plateNumber`
  - `color`

## Postman

La colección está disponible en:

- [docs/postman_collection.json](</C:/Users/user/OneDrive - Cofincafe/Documentos/prueba-ufinet-autos/docs/postman_collection.json>)

Incluye:

- carpeta `Auth`
  - Register
  - Login

- carpeta `Cars`
  - Get Cars
  - Get Car By Id
  - Create Car
  - Update Car
  - Delete Car

La colección usa variables para:

- `baseUrl`
- `token`
- `carId`

## Manejo de Errores

El backend incluye manejo global de errores para:

- validaciones de request
- credenciales inválidas
- recursos no encontrados
- recursos duplicados

El frontend transforma esos errores en mensajes amigables para el usuario.

## Validaciones Ejecutadas

Durante la construcción del proyecto se validó:

- compilación del backend con `mvn clean compile -DskipTests`
- build del frontend con `npm run build`
- integración de PostgreSQL
- configuración CORS para `http://localhost:5173`

## Mejoras Futuras

Posibles siguientes pasos:

- agregar tests automáticos
- separar aún más dominio e infraestructura
- incorporar paginación o búsqueda server-side
- gestionar secretos por perfiles o variables seguras
- agregar despliegue automatizado
- implementar carga real de imágenes

## Autor

Entrega técnica desarrollada para `prueba-ufinet-autos`.
