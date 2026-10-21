
const API_URL = 'http://10.134.133.133:3000';

export async function obtenerMangas() {
  const response = await fetch(`${API_URL}/mangas`);

  if (!response.ok) {
    throw new Error('No se pudieron obtener los mangas');
  }

  return response.json();
}

export async function crearManga(manga: {
  titulo: string;
  editorial?: string;
  autor?: string;
  total_tomos: number;
  estado_publicacion?: 'en_emision' | 'finalizada';
  imagen_url?: string;
}) {
  const response = await fetch(`${API_URL}/mangas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(manga),
  });

  if (!response.ok) {
    throw new Error('No se pudo guardar el manga');
  }

  return response.json();
}
