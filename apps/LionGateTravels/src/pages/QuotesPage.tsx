import React, { useMemo, useState } from "react";
import { StoreState, uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
const STATUSES=["Draft","Waiting reply","Sent","Accepted"];
export const QuotesPage: React.FC<{state:StoreState; setState:(s:StoreState)=>void}> = ({state,setState}) => {
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [query, setQuery] = useState<string>("");
  const q = query.trim().toLowerCase();
  const matches = (obj: any) => !q || JSON.stringify(obj).toLowerCase().includes(q);
  const selected = useMemo(()=> selectedId? state.quotes.find(q=>q.id===selectedId)??null:null,[selectedId,state]);
  const [reference,setReference]=useState(""); const [status,setStatus]=useState("Draft"); const [notes,setNotes]=useState("");
  const dirty = selected? (notes!==(selected.notes??"") || status!==selected.status): reference!=="";
  React.useEffect(()=>{ if(selected){ setNotes(selected.notes??""); setStatus(selected.status);} },[selected]);
  const create=()=>{ pushUndo(state); setState({...state, quotes:[...state.quotes,{id:uid("quote"), reference: reference||"Q-NEW", traveller:"—", destination:"—", value:"—", status, notes}]}); };
  const save=()=>{ if(!selected) return; pushUndo(state); setState({...state, quotes: state.quotes.map(q=> q.id===selected.id? {...q, status, notes}: q)}); };
  return (
    <main className="to-dashboard"><section className="to-section"><h1 className="to-h1">Quotes</h1>
      <div className="to-searchbar">
        <input className="to-input" placeholder="Search quotes…" value={query} onChange={e=>setQuery(e.target.value)} />
      </div>
      <div className="to-table-card">
        <div className="to-table-header to-table-header-5"><span>Ref</span><span>Traveller</span><span>Destination</span><span>Value</span><span>Status</span></div>
        {state.quotes.filter(matches).map(q=>(
          <div key={q.id} className={"to-table-row to-table-row-5 to-table-row-clickable"+(q.id===selectedId?" to-table-row-selected":"")} onClick={()=>setSelectedId(q.id)}>
            <span>{q.reference}</span><span>{q.traveller}</span><span>{q.destination}</span><span>{q.value}</span><span className="to-pill-slim">{q.status}</span>
          </div>
        ))}
      </div>
      <DetailDrawer isOpen={!!selectedId} title={selected?selected.reference:"New Quote"} dirty={dirty} onClose={()=>setSelectedId(null)}>
        {!selected ? (
          <div className="to-drawer-grid">
            <div className="to-kv"><div className="to-k">Reference</div><input className="to-input" value={reference} onChange={e=>setReference(e.target.value)} /></div>
            <div className="to-kv"><div className="to-k">Status</div><select className="to-input" value={status} onChange={e=>setStatus(e.target.value)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="to-kv to-kv-wide"><div className="to-k">Notes</div><textarea className="to-textarea" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
            <div className="to-drawer-actions"><button className="to-primary-btn" onClick={create}>Create</button></div>
          </div>
        ):(
          <div className="to-drawer-grid">
            <div className="to-kv"><div className="to-k">Status</div><select className="to-input" value={status} onChange={e=>setStatus(e.target.value)}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="to-kv to-kv-wide"><div className="to-k">Notes</div><textarea className="to-textarea" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
            <div className="to-drawer-actions"><button className="to-primary-btn" onClick={save}>Save</button></div>
          </div>
        )}
      </DetailDrawer>
    </section></main>
  );
};