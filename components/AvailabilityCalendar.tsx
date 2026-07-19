"use client";
import { useMemo, useState } from "react";
import type { Cottage } from "@/lib/types";
const fmt=(d:Date)=>d.toISOString().slice(0,10);
export default function AvailabilityCalendar({ranges=[]}:{ranges:Cottage["blockedRanges"]}){
 const [cursor,setCursor]=useState(()=>new Date()); const year=cursor.getFullYear(),month=cursor.getMonth();
 const cells=useMemo(()=>{const first=new Date(year,month,1);const lead=(first.getDay()+6)%7;const days=new Date(year,month+1,0).getDate();return [...Array(lead).fill(null),...Array.from({length:days},(_,i)=>new Date(year,month,i+1))]},[year,month]);
 const today=fmt(new Date()); const booked=(s:string)=>(ranges||[]).some(r=>s>=r.start&&s<r.end);
 return <div className="rounded-2xl border p-5"><div className="mb-4 flex items-center justify-between"><button onClick={()=>setCursor(new Date(year,month-1,1))} className="rounded-lg border px-3 py-2">←</button><strong>{cursor.toLocaleDateString("fi-FI",{month:"long",year:"numeric"})}</strong><button onClick={()=>setCursor(new Date(year,month+1,1))} className="rounded-lg border px-3 py-2">→</button></div><div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500">{["Ma","Ti","Ke","To","Pe","La","Su"].map(x=><div key={x}>{x}</div>)}</div><div className="mt-2 grid grid-cols-7 gap-2">{cells.map((d,i)=>{if(!d)return <div key={i}/>;const s=fmt(d),past=s<today,b=booked(s);return <div key={s} title={past?"Mennyt":b?"Varattu":"Vapaa"} className={`grid aspect-square place-items-center rounded-lg text-sm ${past?"bg-slate-200 text-slate-400":b?"bg-red-100 font-bold text-red-700":"bg-green-100 font-bold text-green-700"}`}>{d.getDate()}</div>})}</div><div className="mt-4 flex flex-wrap gap-4 text-sm"><span>🟢 Vapaa</span><span>🔴 Varattu</span><span>⚪ Mennyt</span></div></div>
}
// Vercel rebuild
