import { apiRequest } from './api';

export async function getAdminSummary() {
  const response = await apiRequest('/admin/resumen');
  return response.data;
}

export async function getAdminUsers() {
  const response = await apiRequest('/admin/usuarios');
  return response.data || [];
}

export async function updateAdminUser(userId, data) {
  const response = await apiRequest(`/admin/usuarios/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.data;
}

export async function deleteAdminUser(userId) {
  return apiRequest(`/admin/usuarios/${userId}`, { method: 'DELETE' });
}

export async function getAdminCenters() {
  const response = await apiRequest('/admin/centros-reciclaje');
  return response.data || [];
}

export async function createAdminCenter(data) {
  const response = await apiRequest('/admin/centros-reciclaje', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.data;
}

export async function updateAdminCenter(centerId, data) {
  const response = await apiRequest(`/admin/centros-reciclaje/${centerId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.data;
}

export async function deleteAdminCenter(centerId) {
  return apiRequest(`/admin/centros-reciclaje/${centerId}`, { method: 'DELETE' });
}

export async function getAdminRewards() {
  const response = await apiRequest('/admin/recompensas');
  return response.data || [];
}

export async function createAdminReward(data) {
  const response = await apiRequest('/admin/recompensas', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.data;
}

export async function updateAdminReward(rewardId, data) {
  const response = await apiRequest(`/admin/recompensas/${rewardId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.data;
}

export async function deleteAdminReward(rewardId) {
  return apiRequest(`/admin/recompensas/${rewardId}`, { method: 'DELETE' });
}

export async function getAdminClaims() {
  const response = await apiRequest('/admin/canjes-recompensa');
  return response.data || [];
}

export async function updateAdminClaim(claimId, estado) {
  const response = await apiRequest(`/admin/canjes-recompensa/${claimId}`, {
    method: 'PUT',
    body: JSON.stringify({ estado })
  });
  return response.data;
}
