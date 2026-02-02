import React from "react";
export const SearchBar:React.FC<{value:string;onChange:(v:string)=>void;placeholder?:string}>=({value,onChange,placeholder})=> (
  <input className="to-input" placeholder={placeholder||"Search"} value={value} onChange={e=>onChange(e.target.value)} />
);