Ayúdame a crear un proyecto en nestjs que tenga gestión de roles, según usuario que se loguee, y que permita la creación de endpoints que serán llamados desde un proyecto frontEnd. La gestión de usuarios y roles de usuario debe de ser usando alguna de las herramientas, librerías o utilidades de nextjs. La base de datos que usará el proyecto será mysql y usaremos typeorm para hacer consultas a la base de datos de mysql. Quiero que me ayudes paso a paso a crear el proyecto, instalar las liberías que hagan falta, a instalar git en el proyecto, a subirlo a mi cuenta de github, y a crear las primeras tablas de usuarios y roles en mysql. También quiero que me ayudes a levantar los ficheros que necesite para crear contendores docker para mysql y los que veas que sean necesarios.
------------------------------------------------------------------------------------------------------------------------
Te ayudo a crear un proyecto completo de NestJS con gestión de roles y usuarios. Vamos paso a paso.
Paso 1: Crear el workspace y configurar el proyecto
Using "Create New Workspace"
------------------------------------------------------------------------------------------------------------------------
Por favor, todo contéstamelo en español.
------------------------------------------------------------------------------------------------------------------------
Perfecto, te ayudo a crear el proyecto de NestJS paso a paso en español. Comencemos:
Paso 1: Verificar el directorio actual y crear el proyecto
Primero vamos a ver dónde estamos y crear el proyecto NestJS:
pwd && ls -la

Ahora vamos al directorio de trabajo y creamos el proyecto NestJS:
cd trabajo && pwd
mkdir -p trabajo && cd trabajo && pwd
cd /home/socger/trabajo && pwd

Paso 2: Instalar NestJS CLI y crear el proyecto
npm install -g @nestjs/cli
------------------------------------------------------------------------------------------------------------------------
El comando que me has pasado me devuelve el siguiente error ... internal/modules/cjs/loader.js:934
throw err;
^

Error: Cannot find module '\wsl.localhost\Ubuntu-22.04\mnt\c\Program Files\nodejs\node_modules\npm\bin\npm-cli.js'
at Function.Module._resolveFilename (internal/modules/cjs/loader.js:931:15)
at Function.Module._load (internal/modules/cjs/loader.js:774:27)
at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:75:12)
at internal/main/run_main_module.js:17:47 {
code: 'MODULE_NOT_FOUND',
requireStack: []
}
------------------------------------------------------------------------------------------------------------------------
Veo que hay un problema con la instalación de Node.js. Parece que estás en WSL (Windows Subsystem for Linux) y hay un conflicto con la instalación de Node.js. Vamos a solucionarlo paso a paso.

Paso 1: Verificar y arreglar la instalación de Node.js
which node && which npm
------------------------------------------------------------------------------------------------------------------------
La terminal no devuelve nada
------------------------------------------------------------------------------------------------------------------------
Entiendo, no hay Node.js instalado en tu sistema WSL. Vamos a instalarlo correctamente. Te voy a ayudar a instalar Node.js usando nvm (Node Version Manager) que es la forma más recomendada en WSL.

Paso 1: Instalar Node.js usando nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
------------------------------------------------------------------------------------------------------------------------
La terminal devuelve lo siguiente ...

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
% Total % Received % Xferd Average Speed Time Time Time Current
Dload Upload Total Spent Left Speed
100 14984 100 14984 0 0 54613 0 --:--:-- --:--:-- --:--:-- 54686
=> Downloading nvm from git to '/home/socger/.nvm'
=> Cloning into '/home/socger/.nvm'...
remote: Enumerating objects: 383, done.
remote: Counting objects: 100% (383/383), done.
remote: Compressing objects: 100% (326/326), done.
remote: Total 383 (delta 43), reused 179 (delta 29), pack-reused 0 (from 0)
Receiving objects: 100% (383/383), 392.12 KiB | 397.00 KiB/s, done.
Resolving deltas: 100% (43/43), done.

(HEAD detached at FETCH_HEAD)
master
=> Compressing and cleaning up git repository
=> Appending nvm source string to /home/socger/.bashrc
=> Appending bash_completion source string to /home/socger/.bashrc
internal/modules/cjs/loader.js:934
throw err;
^

Error: Cannot find module '\wsl.localhost\Ubuntu-22.04\mnt\c\Program Files\nodejs\node_modules\npm\bin\npm-cli.js'
at Function.Module._resolveFilename (internal/modules/cjs/loader.js:931:15)
at Function.Module._load (internal/modules/cjs/loader.js:774:27)
at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:75:12)
at internal/main/run_main_module.js:17:47 {
code: 'MODULE_NOT_FOUND',
requireStack: []
}
=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion" # This loads nvm bash_completion
------------------------------------------------------------------------------------------------------------------------
Perfecto, nvm se instaló correctamente. El error al final es porque hay una instalación previa de Node.js que está causando conflictos. Vamos a cargar nvm y instalar una versión limpia de Node.js:

Paso 2: Cargar nvm e instalar Node.js ...

export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

nvm --version

Ahora instalemos Node.js:
nvm install 18
node --version && npm --version

Paso 3: Instalar NestJS CLI y crear el proyecto
npm install -g @nestjs/cli
cd /home/socger/trabajo && nest --version
nest --version

Ahora creemos el proyecto:
nest new user-role-management-api
------------------------------------------------------------------------------------------------------------------------
Para que lo tengas en cuenta a partir de ahora, al proyecto lo he llamado socgerfleet. Y lo he creado con el comando "nest new socgerfleet". Puedes continuar con el paso a paso
------------------------------------------------------------------------------------------------------------------------
¡Perfecto! Gracias por la información. El proyecto se llama socgerfleet y ya está creado. Continuemos con el siguiente paso.

Paso 4: Entrar al proyecto e instalar las dependencias necesarias
cd socgerfleet && ls -la
pwd && ls -la

Ya estamos dentro del proyecto socgerfleet. Ahora vamos a instalar todas las dependencias necesarias para nuestro sistema de gestión de usuarios y roles con MySQL y TypeORM.

Paso 5: Instalar las dependencias necesarias
npm install @nestjs/typeorm @nestjs/jwt @nestjs/passport @nestjs/config typeorm mysql2 passport passport-jwt passport-local bcryptjs class-validator class-transformer

Paso 6: Instalar las dependencias de desarrollo
npm install --save-dev @types/passport-jwt @types/passport-local @types/bcryptjs

Paso 7: Crear archivos Docker para MySQL

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: socgerfleet_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: socgerfleet
      MYSQL_USER: socger
      MYSQL_PASSWORD: socger123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/mysql/init:/docker-entrypoint-initdb.d
    networks:
      - socgerfleet_network

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: socgerfleet_phpmyadmin
    restart: always
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      PMA_USER: root
      PMA_PASSWORD: root123
    ports:
      - "8080:80"
    depends_on:
      - mysql
    networks:
      - socgerfleet_network

volumes:
  mysql_data:

networks:
  socgerfleet_network:
    driver: bridge
EOF

Paso 8: Crear archivo .env y directorio de inicialización

cat > .env <<'EOF'
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=socger
DB_PASSWORD=socger123
DB_DATABASE=socgerfleet

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# App
PORT=3000
NODE_ENV=development
EOF

Crear directorio para scripts de inicialización de MySQL
mkdir -p docker/mysql/init

Crear primer script de inicialización de mysql

cat > docker/mysql/init/01_create_tables.sql <<'EOF'
-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla intermedia para usuarios y roles (muchos a muchos)
CREATE TABLE IF NOT EXISTS user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_id, role_id)
);

-- Insertar roles por defecto
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrador del sistema con todos los permisos'),
('user', 'Usuario básico del sistema'),
('moderator', 'Moderador con permisos especiales')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO users (username, email, password, first_name, last_name) VALUES 
('admin', 'admin@socgerfleet.com', '$2b$10$rOZJlUHbJlU4YxY4A6jgG.GvHaGm6JWrOKNgJZKjUhB5LZjNJX2Y.', 'Admin', 'User')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Asignar rol de admin al usuario admin
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM users u, roles r 
WHERE u.username = 'admin' AND r.name = 'admin'
ON DUPLICATE KEY UPDATE assigned_at = CURRENT_TIMESTAMP;
EOF

Paso 9: Crear las entidades TypeORM
Ahora vamos a crear las entidades de TypeORM para usuarios y roles.

Crear directorio para las entidades
mkdir -p src/entities

Vamos a crear las entidades usando comandos de terminal:
Crear entidad Role con TypeORM

cat > src/entities/role.entity.ts <<'EOF'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
EOF


Crear entidad User con TypeORM

cat > src/entities/user.entity.ts <<'EOF'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  @Exclude()
  password: string;

  @Column({ name: 'first_name', length: 50, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 50, nullable: true })
  lastName: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
EOF


Paso 10: Configurar TypeORM en el módulo principal
mkdir -p src/database

cat > src/database/database.config.ts <<'EOF'
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'socger',
  password: process.env.DB_PASSWORD || 'socger123',
  database: process.env.DB_DATABASE || 'socgerfleet',
  entities: [User, Role],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
});
EOF

Paso 11: Actualizar el app.module.ts
cp src/app.module.ts src/app.module.ts.backup

Actualizar app.module.ts con configuración de base de datos

cat > src/app.module.ts <<'EOF'
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
EOF


Paso 12: Inicializar Git y configurar repositorio
git init

cp .gitignore .gitignore.backup

cat > .gitignore <<'EOF'
# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
# Environment variables
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# Docker
docker-compose.override.yml

# Database
*.sqlite
*.sqlite3
/mysql_data

# temp directory
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
EOF

Paso 13: Configurar Git y hacer el primer commit
git add .


