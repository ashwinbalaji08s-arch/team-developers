import test from 'node:test';
import assert from 'node:assert/strict';
import { dbStore, INITIAL_PROFILES } from './store.ts';

test('dbStore retrieves initial institutions and profiles', () => {
  const institutions = dbStore.getInstitutions();
  assert.ok(institutions.length >= 5, 'Should have at least 5 institutions');
  assert.equal(institutions[0].name, 'Apex Institute of Technology & Research');

  const profiles = dbStore.getProfiles();
  assert.equal(profiles.length, INITIAL_PROFILES.length);
});

test('generateRandomAssignment generates assignment and logs audit event', () => {
  const result = dbStore.generateRandomAssignment();
  assert.equal(result.success, true);
  assert.ok(result.assignment);
  assert.ok(result.assignment.id.startsWith('asg-'));
  assert.equal(result.assignment.status, 'scheduled');
  assert.equal(result.assignment.conflict_checked, true);

  // Check audit log contains the event
  const events = dbStore.getAuditEvents();
  const found = events.some(e => e.action === 'RANDOM_ASSIGNMENT_GENERATED');
  assert.equal(found, true, 'Audit log should record the assignment event');
});

test('getDashboardMetrics aggregates real values accurately', () => {
  const metrics = dbStore.getDashboardMetrics();
  assert.ok(metrics.total_institutions >= 5);
  assert.ok(typeof metrics.compliance_rate_percent === 'number');
  assert.ok(metrics.category_compliance.length > 0);
});
