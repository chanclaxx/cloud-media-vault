import mongoose from 'mongoose';
import { env } from './env.js';

export async function conectarDB() {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log(
      `[db] MongoDB conectado: ${mongoose.connection.name}`
    );
  } catch (error) {
    console.error(
      '[db] No se pudo conectar a MongoDB. Revisa MONGODB_URI y Network Access en Atlas.'
    );
    console.error(`[db] Detalle: ${error.message}`);

    throw error;
  }
}
