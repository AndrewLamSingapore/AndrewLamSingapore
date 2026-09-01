import assert from 'node:assert/strict';
import {
  CONTRACT_VERSION,
  validateActionEnvelope,
  validateEventEnvelope,
  validatePolicyState,
  validatePortfolioEvent,
  validateReasoningOutput,
  validateVerification,
} from '../generated/javascript/validators.js';

const timestamp = '2026-09-01T00:00:00.000Z';
const action = {
  tenant_id: 'personal',
  actor_id: 'owner',
  actor_type: 'user',
  action: 'review.approve',
  parameters: {},
  context: {},
  correlation_id: 'conformance-0001',
  idempotency_key: 'conformance-action-0001',
  schema_version: '1.0.0',
  timestamp,
};
const event = {
  schema_version: '1.0.0',
  event_id: 'conformance-event-0001',
  event_type: 'velyqua.observation.recorded',
  source: 'velyqua',
  occurred_at: timestamp,
  correlation_id: 'conformance-0001',
  subject_id: 'observation-0001',
  evidence_level: 'E2',
  provenance: ['sensor:fixture-0001'],
  payload: { temperature_c: 26 },
};
const reasoning = {
  kind: 'abstain',
  confidence: 0.2,
  decision_summary: 'Verified evidence is not yet sufficient.',
  evidence_refs: [],
  gaps: ['A verified observation is required.'],
  reasoner_version: 'conformance-fixture',
  schema_version: '1.0.0',
};

assert.equal(CONTRACT_VERSION, '2.0.0');
for (const [name, result] of [
  ['action', validateActionEnvelope(action)],
  ['event envelope', validateEventEnvelope({tenant_id:'personal',event_type:event.event_type,source:event.source,payload:event.payload,correlation_id:event.correlation_id,occurred_at:timestamp,schema_version:'1.0.0'})],
  ['policy state', validatePolicyState('GATED')],
  ['portfolio event', validatePortfolioEvent(event)],
  ['reasoning output', validateReasoningOutput(reasoning)],
  ['verification', validateVerification({correlation_id:event.correlation_id,command_status:'accepted',execution_status:'not_applicable',outcome_status:'pending',evidence_refs:[],verified_at:timestamp,schema_version:'1.0.0'})],
]) assert.equal(result.valid, true, `${name}: ${JSON.stringify(result.errors)}`);

assert.equal(validateActionEnvelope({...action,schema_version:'1.0'}).valid, false);
assert.equal(validatePortfolioEvent({...event,schema_version:undefined,version:'1.0'}).valid, false);
assert.equal(validatePortfolioEvent({...event,correlation_id:''}).valid, false);
assert.equal(validatePortfolioEvent({...event,provenance:[]}).valid, false);
assert.equal(validateReasoningOutput({...reasoning,schema_version:'1.0'}).valid, false);
assert.equal(validateReasoningOutput({...reasoning,gaps:undefined}).valid, false);
assert.equal(validatePolicyState('UNKNOWN').valid, false);

console.log('Portfolio contract conformance: OK');
