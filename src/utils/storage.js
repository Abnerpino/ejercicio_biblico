export const cargarArchivosGuardados = () => {
  const data = localStorage.getItem('archivosJSON');
  return data ? JSON.parse(data) : [];
};

export const guardarArchivos = (archivos) => {
  localStorage.setItem('archivosJSON', JSON.stringify(archivos));
};
