import { useState, useEffect } from 'react';

interface Photo {
  id: number;
  title: string;
  url: string;
  albumId: number;
}

export function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  // GET - Buscar fotos
  const fetchPhotos = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=6');
    const data = await response.json();
    setPhotos(data);
  };

  // POST - Adicionar foto
  const addPhoto = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos', {
      method: 'POST',
      body: JSON.stringify({
        title: newPhotoTitle,
        albumId: 1,
        url: 'https://via.placeholder.com/600/92c952'
      }),
      headers: {
        'Content-type': 'application/json'
      },
    });
    const data = await response.json();
    setPhotos([...photos, data]);
    setNewPhotoTitle('');
  };

  // PUT - Editar foto
  const updatePhoto = async (id: number, newTitle: string) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/photos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: newTitle,
      }),
      headers: {
        'Content-type': 'application/json'
      },
    });
    const data = await response.json();
    setPhotos(photos.map(photo => photo.id === id ? {...photo, title: newTitle} : photo));
    setEditingPhoto(null);
  };

  // DELETE - Remover foto
  const deletePhoto = async (id: number) => {
    await fetch(`https://jsonplaceholder.typicode.com/photos/${id}`, {
      method: 'DELETE',
    });
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Gerenciador de Fotos</h1>
      
      {/* Formulário para adicionar foto */}
      <div className="mb-6 flex gap-2 justify-center">
        <input
          type="text"
          value={newPhotoTitle}
          onChange={(e) => setNewPhotoTitle(e.target.value)}
          placeholder="Digite o título da foto"
          className="border p-2 rounded w-64"
        />
        <button
          onClick={addPhoto}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Adicionar Foto
        </button>
      </div>

      {/* Grid de fotos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="border rounded-lg p-4 shadow-md">
            <img 
              src={photo.url} 
              alt={photo.title} 
              className="w-full h-48 object-cover rounded-md"
            />
            
            {editingPhoto?.id === photo.id ? (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto({...editingPhoto, title: e.target.value})}
                  className="border p-1 rounded flex-1"
                />
                <button
                  onClick={() => updatePhoto(photo.id, editingPhoto.title)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Salvar
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <h2 className="text-lg font-semibold mb-2">{photo.title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPhoto(photo)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
