import { apiRequest } from './api';

export async function getRecyclingRecords() {
  const response = await apiRequest('/registros-reciclaje');

  return (response.data || []).map((record) => ({
    id: record.id,
    material: record.material,
    quantity: Number(record.cantidad || 0),
    points: Number(record.puntos || 0),
    location: record.ubicacion,
    origin: record.origen,
    note: record.nota,
    createdAt: record.created_at
  }));
}

export async function saveRecyclingRecord(item, scanResult) {
  const response = await apiRequest('/registros-reciclaje', {
    method: 'POST',
    body: JSON.stringify({
      material: item.material,
      cantidad: item.quantity,
      puntos: item.points,
      ubicacion: scanResult.point,
      origen: 'scanner_qr',
      nota: `Comprobante ${scanResult.id}`
    })
  });

  return response.data;
}

export async function saveScanResult(scanResult) {
  const savedRecords = await Promise.all(
    scanResult.items.map((item) => saveRecyclingRecord(item, scanResult))
  );

  return savedRecords;
}
