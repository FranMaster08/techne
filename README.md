# TECHNE Backend

**TECHNE** es una API para la gestión logística de entrega de productos, permitiendo trazabilidad, eficiencia y control total del proceso.  
Este backend está desarrollado con **NestJS** y **TypeORM**, usando **PostgreSQL** como base de datos.


## 🚀 ¿Cómo levantar el proyecto?

### 🔧 Local

1. **Clona el repositorio:**
  ```bash
  git clone https://github.com/tu-usuario/TECHNE-backend.git
  cd TECHNE-backend
  ```

2. **Instala las dependencias:**
  ```bash
  npm install
  ```

3. **Configura las variables de entorno en un archivo `.env`:**
  ```
 PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASS=tu_password
DB_NAME=tu_basededatos

# Opcional: configuración de pool
DB_POOL_MAX=10
DB_IDLE_TIMEOUT=30000
JWT_SECRET=super_secret
JWT_EXPIRES=1d
LOG_LEVEL=error
  ```

4. **Ejecuta migraciones:**
  ```bash
  npm run migration:run
  ```

5. **Levanta el servidor:**
  ```bash
  npm run start:dev
  ```

6. **Accede a la documentación Swagger:**  
  [http://localhost:3000/api-docs](http://localhost:3000/api-docs)



### 🐳 Docker

1. Asegúrate de tener Docker instalado.
2. Crea un archivo `.env` con las variables de entorno necesarias.
3. Construye la imagen y levanta el contenedor:
  ```bash
  docker build -t TECHNE-backend .
  docker run --env-file .env -p 3000:3000 TECHNE-backend
  ```
4. Accede a la API y documentación:  
  [http://localhost:3000/api-docs](http://localhost:3000/api-docs)



## 📦 Tecnologías y librerías usadas

| Tecnología/Librería   | Descripción                        |
|-----------------------|------------------------------------|
| NestJS                | Framework principal backend        |
| TypeORM               | ORM para base de datos             | 
| PostgreSQL            | Base de datos relacional           | 
| Swagger               | Documentación interactiva de la API|
| class-validator       | Validación de DTOs                 | 
| class-transformer     | Transformación de objetos          |
| Docker                | Contenerización y despliegue       | 
| Jest                  | Testing unitario                   | 
| Husky                 | Git hooks para calidad             | 
| ESLint + Prettier     | Linting y formateo de código       | 



## 📖 Endpoints principales

- `POST /user` - Crear usuario
- `GET /user` - Listar usuarios
- `GET /user/:id` - Obtener usuario por ID
- `PATCH /user/:id` - Actualizar usuario
- `DELETE /user/:id` - Eliminar usuario



## 🔄 Migraciones con TypeORM

### 📅 1. Generar una nueva migración

```bash
npm run generate:migration --name=NombreDeTuMigracion
```
Ejemplo:
```bash
npm run generate:migration --name=AddNicknameToUsers
```
Esto creará un archivo en `src/migrations`.



### ▶️ 2. Ejecutar las migraciones

```bash
npm run migration:run
```
Esto aplicará las migraciones pendientes en la base de datos.


### 🔙 3. Revertir la última migración

```bash
npm run migration:revert
```
Esto deshará la última migración ejecutada.



### 👁️ 4. Ver migraciones pendientes

```bash
npm run migration:show
```
Muestra las migraciones que aún no se han aplicado.



## 💡 Flujo recomendado

1. Modifica tus entidades (`*.entity.ts`).
2. Genera una migración:
  ```bash
  npm run generate:migration --name=DescribeCambio
  ```
3. Revisa el contenido del archivo generado.
4. Aplica la migración:
  ```bash
  npm run migration:run
  ```
5. *(Opcional)* Si necesitas revertir:
  ```bash
  npm run migration:revert
  ```



## 📄 Licencia

MIT

