import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStringSha256, calculateGpsDistanceMeters, verifyGeofenceProximity } from './crypto.ts';

test('calculateStringSha256 produces valid 64-char hex string', async () => {
  const hash = await calculateStringSha256('inspectra-evidence-sample');
  assert.equal(typeof hash, 'string');
  assert.equal(hash.length, 64);
  // deterministic test
  const hashAgain = await calculateStringSha256('inspectra-evidence-sample');
  assert.equal(hash, hashAgain);
});

test('calculateGpsDistanceMeters calculates exact zero for identical coordinates', () => {
  const dist = calculateGpsDistanceMeters(28.6139, 77.2090, 28.6139, 77.2090);
  assert.equal(dist, 0);
});

test('calculateGpsDistanceMeters measures distance between New Delhi and Connaught Place (~1.5-2km)', () => {
  // New Delhi (28.6139, 77.2090) to Connaught Place (28.6315, 77.2167)
  const dist = calculateGpsDistanceMeters(28.6139, 77.2090, 28.6315, 77.2167);
  assert.ok(dist > 1500 && dist < 2500, `Expected distance ~2000m, got ${dist}`);
});

test('verifyGeofenceProximity flags locations beyond radius tolerance', () => {
  const resultInside = verifyGeofenceProximity(28.6139, 77.2090, 28.6140, 77.2091, 500);
  assert.equal(resultInside.withinRange, true);

  const resultFar = verifyGeofenceProximity(28.6139, 77.2090, 28.7041, 77.1025, 500);
  assert.equal(resultFar.withinRange, false);
  assert.ok(resultFar.distanceMeters > 5000);
});
