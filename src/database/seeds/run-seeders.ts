import { AppDataSource } from '../data-source';
import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';

async function runSeeders() {
  try {
    console.log('🌱 Iniciando seeders...\n');

    // Inicializar conexión a la base de datos
    await AppDataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida\n');

    // Ejecutar seeder de roles
    console.log('📋 Ejecutando Role Seeder...');
    const roleSeeder = new RoleSeeder();
    await roleSeeder.run();
    console.log('');

    // Ejecutar seeder de usuarios
    console.log('👥 Ejecutando User Seeder...');
    const userSeeder = new UserSeeder();
    await userSeeder.run();
    console.log('');

    console.log('✅ ¡Seeders ejecutados exitosamente!');
    console.log('\n📊 Usuarios creados:');
    console.log('  - admin@socgerfleet.com (contraseña: Admin123!)');
    console.log('  - moderator@socgerfleet.com (contraseña: Moderator123!)');
    console.log('  - user@socgerfleet.com (contraseña: User123!)');
  } catch (error) {
    console.error('❌ Error ejecutando seeders:', error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    await AppDataSource.destroy();
    console.log('\n👋 Conexión cerrada');
    process.exit(0);
  }
}

runSeeders();
