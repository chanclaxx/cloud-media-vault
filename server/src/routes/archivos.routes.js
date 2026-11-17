import { Router } from 'express';
import { uploadArchivo } from '../middlewares/upload.js';
import { crearArchivo, listarArchivos, eliminarArchivo } from '../controllers/archivos.controller.js';

const router = Router();

router.get('/', listarArchivos);
router.post('/', uploadArchivo, crearArchivo);
router.delete('/:id', eliminarArchivo);

export default router;
