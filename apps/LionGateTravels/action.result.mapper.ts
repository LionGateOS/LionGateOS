// action.result.mapper.js
// v39 - Map action outcomes to user-safe messages (TEST MODE)

type Outcome = 'cancel_without_fee' | 'change_basic' | 'file_issue' | null;
interface MapResultReturn {
  ok: boolean;
  message: string;
}

export function mapResult(outcome: Outcome): MapResultReturn {
  switch (outcome) {
    case 'cancel_without_fee':
      return { ok: true, message: 'I handled this for you.' };
    case 'change_basic':
      return { ok: true, message: 'I handled this for you.' };
    case 'file_issue':
      return { ok: true, message: 'I handled this for you.' };
    case null:
    default:
      return { ok: false, message: 'All systems are running normally.' };
  }
}
