"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getPublishedCottages } from "@/lib/cottages";
import type { Cottage } from "@/lib/types";
import CottageCard from "./CottageCard";
const MapClient=dynamic(()=>import("./MapClient"),{ssr:false});

function overlaps(ranges:Cottage["blockedRanges"],start:string,end:string){if(!start||!end)return false;return (ranges||[]).some(r=>start<r.end&&end>r.start)}
export default function SearchMap(){
 const [all,setAll]=useState<Cottage[]>([]); const [city,setCity]=useState(""); const [guests,setGuests]=useState(1); const [start,setStart]=useState(""); const [end,setEnd]=useState(""); const [loading,setLoading]=useState(true);
 useEffect(()=>{getPublishedCottages().then(setAll).finally(()=>setLoading(false))},[]);
 const items=useMemo(()=>all.filter(c=>(!city||`${c.city} ${c.area||""}`.toLowerCase().includes(city.toLowerCase()))&&c.guests>=guests&&!overlaps(c.blockedRanges,start,end)),[all,city,guests,start,end]);
 return <><section className="relative min-h-[560px] bg-cover bg-center" style={{backgroundImage:"linear-gradient(90deg,rgba(248,246,240,.98),rgba(248,246,240,.55),rgba(0,0,0,.05)),url('/hero.jpg')"}}><div className="mx-auto max-w-[1500px] px-5 py-24"><div className="max-w-2xl"><p className="font-black uppercase tracking-widest text-forest">Suoraan mökin omistajalta</p><h1 className="mt-4 text-5xl font-black leading-none md:text-7xl">Löydä täydellinen mökkipaikka</h1><p className="mt-6 text-xl">Etsi vapaita mökkejä ja ota yhteyttä omistajaan suoraan.</p></div><div className="mt-12 grid gap-3 rounded-2xl bg-white p-4 shadow-2xl md:grid-cols-5"><input className="rounded-xl border p-4" placeholder="Alue tai kaupunki" value={city} onChange={e=>setCity(e.target.value)}/><input type="date" className="rounded-xl border p-4" value={start} onChange={e=>setStart(e.target.value)}/><input type="date" className="rounded-xl border p-4" value={end} onChange={e=>setEnd(e.target.value)}/><input type="number" min={1} className="rounded-xl border p-4" value={guests} onChange={e=>setGuests(Number(e.target.value))}/><button className="rounded-xl bg-forest p-4 font-black text-white">Hae mökkejä</button></div></div></section><section className="mx-auto grid max-w-[1500px] gap-6 px-5 py-10 lg:grid-cols-[1.05fr_.95fr]"><div><div className="mb-5 flex items-end justify-between"><div><h2 className="text-3xl font-black">Vapaat mökit</h2><p className="text-slate-600">{items.length} kohdetta</p></div></div><div className="grid gap-5 sm:grid-cols-2">{loading?<p>Ladataan...</p>:items.map(c=><CottageCard key={c.id} cottage={c}/>)}</div></div><div className="sticky top-24 h-[calc(100vh-120px)] min-h-[600px] overflow-hidden rounded-2xl border"><MapClient items={items}/></div></section></>
}
