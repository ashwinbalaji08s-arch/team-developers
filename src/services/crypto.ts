/**
 * Inspectra AI - Cryptographic Verification Utilities
 * Uses standard Web Crypto API (SubtleCrypto) for client-side SHA-256 hashing.
 */

export async function calculateFileSha256(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexHash;
}

export async function calculateStringSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculates haversine distance in meters between two GPS coordinates.
 */
export function calculateGpsDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Checks if capture coordinates are within acceptable geofence tolerance (e.g. 500m)
 * of the target institution.
 */
export function verifyGeofenceProximity(
  actualLat: number,
  actualLon: number,
  targetLat: number,
  targetLon: number,
  allowedRadiusMeters = 500
): { withinRange: boolean; distanceMeters: number } {
  const distance = calculateGpsDistanceMeters(actualLat, actualLon, targetLat, targetLon);
  return {
    withinRange: distance <= allowedRadiusMeters,
    distanceMeters: distance,
  };
}
