const KEY = "to.v22";
const empty = { trips: [], quotes: [], clients: [], tasks: [] };
export const load = () => { try {
    const r = localStorage.getItem(KEY);
    return r ? JSON.parse(r) : empty;
}
catch {
    return empty;
} };
export const save = (s) => localStorage.setItem(KEY, JSON.stringify(s));
let id = Date.now();
export const uid = (p) => `${p}_${id++}`;
export function pushUndo(state) {
    if (!state || typeof state !== "object")
        return;
    try {
        state.__undo = JSON.parse(JSON.stringify(state));
    }
    catch {
        /* noop */
    }
}
