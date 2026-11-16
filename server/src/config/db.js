// Conexión a MongoDB Atlas con Mongoose.  Dueño: Rol 1
import mongoose from 'mongoose';
import { env } from './env.js';

export async function conectarDB() {
  // TODO(Rol 1): conectar a MongoDB Atlas.
  //   1. await mongoose.connect(env.MONGODB_URI)
  //   2. Si conecta: console.log('[db] MongoDB conectado: <nombre de la BD>')
  //      (mongoose.connection.name tiene el nombre; NO imprimir la URI, tiene la contraseña).
  //   3. Si falla: mostrar un mensaje entendible (ej. "revisa MONGODB_URI y Network Access en Atlas")
  //      y terminar el proceso con process.exit(1).
  //   Errores típicos:
  //     - "bad auth" -> usuario/contraseña de la BD mal (no es la contraseña de tu cuenta de Atlas).
  //     - timeout / "Could not connect to any servers" -> tu IP no está en Network Access (usar 0.0.0.0/0).
  //     - caracteres especiales en la contraseña (@, :, /) -> deben ir codificados (encodeURIComponent).
  void mongoose;
  void env;
  console.warn('[db] TODO(Rol 1): la conexión a MongoDB aún no está implementada.');
}
