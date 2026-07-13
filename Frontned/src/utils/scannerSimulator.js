import { materials } from '../data/mockData';

export function createQrScanResult() {
  const shuffledMaterials = [...materials].sort(() => 0.5 - Math.random());
  const selectedItems = shuffledMaterials.slice(0, Math.floor(Math.random() * 3) + 2);
  const recycledItems = selectedItems.map((material) => {
    const quantity = Math.floor(Math.random() * 4) + 1;

    return {
      material: material.name,
      quantity,
      points: quantity * material.points,
      color: material.color,
      icon: material.icon
    };
  });

  const totalPoints = recycledItems.reduce((sum, item) => sum + item.points, 0);
  const totalQuantity = recycledItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: `QR-${Date.now().toString().slice(-6)}`,
    point: 'EcoPunto Universidad',
    date: new Date().toLocaleDateString(),
    items: recycledItems,
    totalPoints,
    totalQuantity
  };
}

export function scanResultToActivity(scanResult) {
  return scanResult.items.map((item, index) => ({
    id: Date.now() + index,
    material: item.material,
    quantity: item.quantity,
    points: item.points
  }));
}
