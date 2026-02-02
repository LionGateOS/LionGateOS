import React, { useMemo, useState } from "react";
import { StoreState, uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
export const ClientsPage: React.FC<{state:StoreState; setState:(s:StoreState)=>void}> = ({state,setState}) => {
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [query, setQuery] = useState<string>("");
  const q = query.trim().toLowerCase();
  const matches = (obj: any) => !q || JSON.stringify(obj).toLowerCase().includes(q);
  const selected = useMemo(()=> selectedId? state.clients.find(c=>c.id===selectedId)??null:null,[selectedId,state]);
  const [name,setName]=useState(""); const [segment,setSegment]=useState("Leisure"); const [notes,setNotes]=useState("");
  const dirty = selected? (notes!==selected.notes || segment!==selected.segment): name!=="";
  React.useEffect(()=>{ if(selected){ setNotes(selected.notes); setSegment(selected.segment);} },[selected]);
  const create=()=>{ pushUndo(state); setState({...state, clients:[...state.clients,{id:uid("client"), name: name||"New client", segment, notes}]}); };
  const save=()=>{ if(!selected) return; pushUndo(state); setState({...state, clients: state.clients.map(c=> c.id===selected.id? {...c, segment, notes}: c)}); };
  return (
    <main className="to-dashboard"><section className="to-section"><h1 className="to-h1">Clients</h1>
      <div className="to-searchbar">
        <input className="to-input" placeholder="Search clients…" value={query} onChange={e=>setQuery(e.target.value)} />
      </div>
      <div className="to-table-card">
        <div className="to-table-header to-table-header-3"><span>Name</span><span>Segment</span><span>Notes</span></div>
        {state.clients.filter(matches).map(c=>(
          <div key={c.id} className={"to-table-row to-table-row-3 to-table-row-clickable"+(c.id===selectedId?" to-table-row-selected":"")} onClick={()=>setSelectedId(c.id)}>
            <span>{c.name}</span><span>{c.segment}</span><span>{c.notes}</span>
          </div>
        ))}
      </div>
      <DetailDrawer isOpen={!!selectedId} title={selected?selected.name:"New Client"} dirty={dirty} onClose={()=>setSelectedId(null)}>
        {!selected ? (
          <div className="to-drawer-grid">
            <div className="to-kv"><div className="to-k">Name</div><input className="to-input" value={name} onChange={e=>setName(e.target.value)} /></div>
            <div className="to-kv"><div className="to-k">Segment</div><input className="to-input" value={segment} onChange={e=>setSegment(e.target.value)} /></div>
            <div className="to-kv to-kv-wide"><div className="to-k">Notes</div><textarea className="to-textarea" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
            <div className="to-drawer-actions"><button className="to-primary-btn" onClick={create}>Create</button></div>
          </div>
        ):(
          <div className="to-drawer-grid">
            <div className="to-kv"><div className="to-k">Segment</div><input className="to-input" value={segment} onChange={e=>setSegment(e.target.value)} /></div>
            <div className="to-kv to-kv-wide"><div className="to-k">Notes</div><textarea className="to-textarea" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
            <div className="to-drawer-actions"><button className="to-primary-btn" onClick={save}>Save</button></div>
          </div>
        )}
      </DetailDrawer>
    </section></main>
  );
};