// This .js was created to be manually tested in case I needed to change a user's password hash in the DB.
// Run it with in the :
// cd /home/socger/trabajo/socger/socgerfleet && node generate-hash.mjs
import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = 'admin123';
  const saltRounds = 10;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`Contraseña: ${password}`);
    console.log(`Hash generado: ${hash}`);

    // Verificar que el hash funciona
    const isValid = await bcrypt.compare(password, hash);
    console.log(`Verificación: ${isValid ? 'OK' : 'ERROR'}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateHash();
