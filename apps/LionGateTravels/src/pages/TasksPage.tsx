import React, { useMemo, useState } from "react";
import { StoreState, uid, pushUndo } from "../data/store";
import { DetailDrawer } from "../components/DetailDrawer";
export const TasksPage: React.FC<{state:StoreState; setState:(s:StoreState)=>void}> = ({state,setState}) => {
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [query, setQuery] = useState<string>("");
  const q = query.trim().toLowerCase();
  const matches = (obj: any) => !q || JSON.stringify(obj).toLowerCase().includes(q);
  const selected = useMemo(()=> selectedId? state.tasks.find(t=>t.id===selectedId)??null:null,[selectedId,state]);
  const [title,setTitle]=useState(""); const [notes,setNotes]=useState("");
  const dirty = selected? notes!==(selected.notes??""): title!=="";
  React.useEffect(()=>{ if(selected){ setNotes(selected.notes??""); } },[selected]);
  const create=()=>{ pushUndo(state); setState({...state, tasks:[...state.tasks,{id:uid("task"), title: title||"New task", due:"—", context:"—", notes}]}); };
  const save=()=>{ if(!selected) return; pushUndo(state); setState({...state, tasks: state.tasks.map(t=> t.id===selected.id? {...t, notes}: t)}); };
  return (
    <main className="to-dashboard"><section className="to-section"><h1 className="to-h1">Tasks</h1>
      <div className="to-searchbar">
        <input className="to-input" placeholder="Search tasks…" value={query} onChange={e=>setQuery(e.target.value)} />
      </div>
      <div className="to-table-card">
        <div className="to-table-header to-table-header-3"><span>Task</span><span>When</span><span>Related to</span></div>
        {state.tasks.filter(matches).map(t=>(
          <div key={t.id} className={"to-table-row to-table-row-3 to-table-row-clickable"+(t.id===selectedId?" to-table-row-selected":"")} onClick={()=>setSelectedId(t.id)}>
            <span>{t.title}</span><span>{t.due}</span><span>{t.context}</span>
          </div>
        ))}
      </div>
      <DetailDrawer isOpen={!!selectedId} title={selected?selected.title:"New Task"} dirty={dirty} onClose={()=>setSelectedId(null)}>
        {!selected ? (
          <div className="to-drawer-grid">
            <div className="to-kv"><div className="to-k">Title</div><input className="to-input" value={title} onChange={e=>setTitle(e.target.value)} /></div>
            <div className="to-kv to-kv-wide"><div className="to-k">Notes</div><textarea className="to-textarea" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
            <div className="to-drawer-actions"><button className="to-primary-btn" onClick={create}>Create</button></div>
          </div>
        ):(
          <div className="to-drawer-grid">
            <div className="to-kv to-kv-wide"><div className="to-k">Notes</div><textarea className="to-textarea" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
            <div className="to-drawer-actions"><button className="to-primary-btn" onClick={save}>Save</button></div>
          </div>
        )}
      </DetailDrawer>
    </section></main>
  );
};