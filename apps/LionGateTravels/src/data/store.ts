
export type Item={id:string;[k:string]:any};
export type StoreState={trips:Item[];quotes:Item[];clients:Item[];tasks:Item[]};
const KEY="to.v22"; const empty:StoreState={trips:[],quotes:[],clients:[],tasks:[]};
export const load=():StoreState=>{try{const r=localStorage.getItem(KEY);return r?JSON.parse(r):empty}catch{return empty}};
export const save=(s:StoreState)=>localStorage.setItem(KEY,JSON.stringify(s));
let id=Date.now(); export const uid=(p:string)=>`${p}_${id++}`;


export function pushUndo(state: StoreState) {
  if (!state || typeof state !== "object") return;
  try {
    (state as any).__undo = JSON.parse(JSON.stringify(state));
  } catch {
    /* noop */
  }
}
