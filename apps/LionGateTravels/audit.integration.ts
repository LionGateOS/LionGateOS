// audit.integration.js
// v34 - integrate audit logging with core actions (TEST MODE)
import { writeAudit } from './audit.writer';
import { AuditEntryInput } from '../../types';

export function auditCancel(ref: string, vendor: string): void {
  writeAudit({ action: 'CANCEL', ref, vendor } as AuditEntryInput);
}

export function auditChange(ref: string, vendor: string): void {
  writeAudit({ action: 'CHANGE', ref, vendor } as AuditEntryInput);
}

export function auditIssue(ref: string, vendor: string): void {
  writeAudit({ action: 'ISSUE', ref, vendor } as AuditEntryInput);
}
