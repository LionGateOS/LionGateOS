// audit.activate.js
// v35 - activate audit logging calls (TEST MODE)
// This file demonstrates where action handlers should call audit helpers.

import { auditCancel, auditChange, auditIssue } from './audit.integration.js';

export function onCancel(ref: string, vendor: string): void {
  auditCancel(ref, vendor);
}

export function onChange(ref: string, vendor: string): void {
  auditChange(ref, vendor);
}

export function onIssue(ref: string, vendor: string): void {
  auditIssue(ref, vendor);
}
