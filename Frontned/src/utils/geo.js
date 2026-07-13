export function calculateDistanceKm(origin, destination) {
  const earthRadiusKm = 6371;
  const latDistance = toRadians(destination.latitude - origin.latitude);
  const lonDistance = toRadians(destination.longitude - origin.longitude);
  const originLat = toRadians(origin.latitude);
  const destinationLat = toRadians(destination.latitude);

  const haversine =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(originLat) *
      Math.cos(destinationLat) *
      Math.sin(lonDistance / 2) *
      Math.sin(lonDistance / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(1)} km`;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}
