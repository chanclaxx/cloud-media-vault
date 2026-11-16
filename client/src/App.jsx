// Layout principal. (Base compartida: coordinar Rol 4 / Rol 5 antes de modificar.)
import { useState } from 'react';
import UploadForm from './components/upload/UploadForm.jsx';
import Gallery from './components/gallery/Gallery.jsx';

export default function App() {
  // Comunicación entre formulario y galería:
  // cuando UploadForm sube un archivo con éxito llama a onSubido(); eso incrementa `version`
  // y Gallery, al ver que `version` cambió, vuelve a pedir la lista al servidor.
  const [version, setVersion] = useState(0);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Cloud Media Vault</h1>
        <p>Sube imágenes, videos y PDF a la nube y consulta sus metadatos.</p>
      </header>

      <main className="app__main">
        <section className="panel" aria-labelledby="titulo-subida">
          <h2 id="titulo-subida">Subir archivo</h2>
          <UploadForm onSubido={() => setVersion((v) => v + 1)} />
        </section>

        <section className="panel" aria-labelledby="titulo-galeria">
          <h2 id="titulo-galeria">Galería</h2>
          <Gallery version={version} />
        </section>
      </main>

      <footer className="app__footer">
        Desarrollo de Experiencias Multimedia para la Web · UAO
      </footer>
    </div>
  );
}
