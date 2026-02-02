// audit.writer.js
// v33 - audit log write scaffold (TEST MODE ONLY)
import { AuditEntryInput, AuditLog } from '../../types';
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';

export function writeAudit(entry: AuditEntryInput): void {
  try {
    const filePath: string = path.join(process.cwd(), 'audit.log.json');
    const raw: AuditLog = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      : { entries: [] };

    raw.entries.push({
      ...entry,
      timestamp: new Date().toISOString(),
      mode: 'TEST'
    });

    fs.writeFileSync(filePath, JSON.stringify(raw, null, 2));
  } catch (err: unknown) {
    // Silent fail in test mode
  }
}
