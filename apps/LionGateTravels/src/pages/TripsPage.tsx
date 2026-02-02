import React, { useMemo, useState } from "react";
import { StoreState, uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";

const STATUSES = ["Confirmed","Quote sent","Deposit due","Cancelled"];

export const TripsPage: React.FC<{state:StoreState; setState:(s:StoreState)=>void}> = ({state,setState}) => {
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [query, setQuery] = useState<string>("");
  const q = query.trim().toLowerCase();
  const matches = (obj: any) => !q || JSON.stringify(obj).toLowerCase().includes(q);
  const selected = useMemo(()=> selectedId? state.trips.find(t=>t.id===selectedId)??null:null,[selectedId,state]);
  const [traveller,setTraveller]=useState(""); const [status,setStatus]=useState("Confirmed"); const [notes,setNotes]=useState("");
  const dirty = selected? (notes!==(selected.notes??"") || status!==selected.status): traveller!=="";

  React.useEffect(()=>{ if(selected){ setNotes(selected.notes??""); setStatus(selected.status);} },[selected]);

  const create=()=>{
    pushUndo(state);
    setState({...state, trips:[...state.trips,{id:uid("trip"), traveller: traveller||"New traveller", destination:"—", dates:"—", status, notes}]});
    setTraveller(""); setNotes(""); setStatus("Confirmed");
  };
  const save=()=>{
    if(!selected) return;
    pushUndo(state);
    setState({...state, trips: state.trips.map(t=> t.id===selected.id? {...t, status, notes}: t)});
  };

  return (
    <main className="to-dashboard"><section className="to-section"><h1 className="to-h1">Trips</h1>
      <div className="to-searchbar">
        <input className="to-input" placeholder="Search trips…" value={query} onChange={e=>setQuery(e.target.value)} />
      </div>
      <div className="to-table-card">
        <div className="to-table-header"><span>Traveller</span><span>Destination</span><span>Dates</span><span>Status</span></div>
        {state.trips.filter(matches).map(t=>(
          <div key={t.id} className={"to-table-row to-table-row-clickable"+(t.id===selectedId?" to-table-row-selected":"")} onClick={()=>setSelectedId(t.id)}>
            <span>{t.traveller}</span><span>{t.destination}</span><span>{t.dates}</span><span className="to-pill-slim">{t.status}</span>
          </div>
        ))}
      </div>
      <DetailDrawer isOpen={!!selectedId} title={selected?selected.traveller:"New Trip"} dirty={dirty} onClose={()=>setSelectedId(null)}>
        {!selected ? (
          <div className="to-drawer-grid">
            <div className="to-kv"><div className="to-k">Traveller</div><input className="to-input" value={traveller} onChange={e=>setTraveller(e.target.value)} /></div>
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