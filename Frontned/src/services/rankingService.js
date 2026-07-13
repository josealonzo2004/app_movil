import { apiRequest } from './api';

export async function getTopUsersRanking() {
  const response = await apiRequest('/ranking/top-usuarios');

  return (response.data || []).map((user) => ({
    position: user.posicion,
    id: user.usuario_id,
    name: user.nombre,
    points: Number(user.puntos || 0)
  }));
}
