export const materials = [
  { id: 'plastico', name: 'Plastico', icon: 'bottle-soda-classic-outline', points: 12, color: '#2F80ED' },
  { id: 'papel', name: 'Papel', icon: 'newspaper-variant-outline', points: 8, color: '#9B6A3D' },
  { id: 'vidrio', name: 'Vidrio', icon: 'glass-fragile', points: 15, color: '#2E7D5B' },
  { id: 'metal', name: 'Metal', icon: 'cube-outline', points: 18, color: '#7A7F87' },
  { id: 'organico', name: 'Organico', icon: 'leaf', points: 6, color: '#6EA843' }
];

export const collectionPoints = [
  {
    id: 1,
    name: 'EcoPunto Universidad',
    address: 'Bloque principal, entrada norte',
    latitude: -0.1807,
    longitude: -78.4678,
    accepts: ['Plastico', 'Papel', 'Metal']
  },
  {
    id: 2,
    name: 'Centro Verde Municipal',
    address: 'Av. Amazonas y Colon',
    latitude: -0.1866,
    longitude: -78.4889,
    accepts: ['Vidrio', 'Organico', 'Papel']
  },
  {
    id: 3,
    name: 'Recicladora Aliada',
    address: 'Calle 10 de Agosto',
    latitude: -0.1712,
    longitude: -78.4801,
    accepts: ['Plastico', 'Vidrio', 'Metal']
  }
];

export const rewards = [
  { id: 1, title: 'Descuento en cafeteria', cost: 120, detail: '10% en bebidas reutilizando tu vaso.' },
  { id: 2, title: 'Kit eco estudiante', cost: 240, detail: 'Bolsa reutilizable y libreta reciclada.' },
  { id: 3, title: 'Certificado verde', cost: 360, detail: 'Reconocimiento por participacion ambiental.' }
];
