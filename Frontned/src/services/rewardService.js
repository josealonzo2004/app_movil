import { apiRequest } from './api';

export async function getRewards() {
  const response = await apiRequest('/recompensas');

  return (response.data || []).map((reward) => ({
    id: reward.id,
    title: reward.nombre,
    detail: reward.descripcion || 'Recompensa disponible para canje.',
    cost: reward.puntos_necesarios,
    available: reward.cantidad_disponible,
    active: reward.activa
  }));
}

export async function getRewardClaims() {
  const response = await apiRequest('/canjes-recompensa');

  return response.data || [];
}

export async function getUsedRewardPoints() {
  const claims = await getRewardClaims();

  return claims
    .filter((claim) => ['pendiente', 'aprobado'].includes(claim.estado))
    .reduce((sum, claim) => sum + Number(claim.puntos_usados || 0), 0);
}

export async function claimRewardById(rewardId) {
  const response = await apiRequest('/canjes-recompensa', {
    method: 'POST',
    body: JSON.stringify({
      recompensa_id: rewardId
    })
  });

  return response.data;
}
