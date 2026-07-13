export function sqrdEuclDist(x1: number, y1: number, x2: number, y2: number): number {
  const dLat = x2 - x1;
  const dLon = y2 - y1;
  return dLat * dLat + dLon * dLon;
}

export function euclDist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(sqrdEuclDist(x1, y1, x2, y2));
}

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6_378_137; // earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}