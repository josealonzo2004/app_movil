import { collectionPoints as fallbackCenters } from '../data/mockData';
import { apiRequest } from './api';

export async function getRecyclingCenters() {
  const response = await apiRequest('/centros-reciclaje');

  return (response.data || [])
    .filter((center) => center.activo === undefined || center.activo)
    .map((center) => ({
      id: center.id,
      name: center.nombre,
      address: center.direccion,
      latitude: Number(center.latitud),
      longitude: Number(center.longitud),
      accepts: center.materiales_aceptados || [],
      schedule: center.horario
    }))
    .filter((center) => Number.isFinite(center.latitude) && Number.isFinite(center.longitude));
}

export { fallbackCenters };
