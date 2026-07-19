"use client";
import { FormEvent, useEffect, useState } from "react";
import { getCottage } from "@/lib/cottages";
import { createInquiry } from "@/lib/inquiries";
import type { Cottage } from "@/lib/types";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { MapPin, Users, Phone, MessageSquare } from "lucide-react";

export default function CottageDetailClient({id}:{id:string}){
 const [c,setC]=useState<Cottage|null>(null);
 const [active,setActive]=useState(0);
 const [showPhone,setShowPhone]=useState(false);
 const [status,setStatus]=useState("");
 const [form,setForm]=useState({name:"",email:"",phone:"",startDate:"",endDate:"",message:""});
 useEffect(()=>{getCottage(id).then(setC)},[id]);
 if(!c)return <div className="p-10">Ladataan...</div>;
 const imgs=c.images?.length?c.images:[c.image||"/hero.jpg"];
 const amenities=Object.entries(c.amenities||{}).filter(([,v])=>v).map(([k])=>({sauna:"Sauna",beach:"Oma ranta",hotTub:"Palju",boat:"Vene",pets:"Lemmikit sallittu",electricity:"Sähköt",drinkingWater:"Juomavesi",indoorToilet:"Sisä-WC"}[k]||k));

 async function submitInquiry(e:FormEvent){
  e.preventDefault();
  if(!c?.ownerId){setStatus("Yhteydenotto ei ole vielä käytettävissä tälle ilmoitukselle.");return;}
  setStatus("Lähetetään...");
  try{
   await createInquiry({
    cottageId:c.id,
    cottageName:c.name,
    ownerId:c.ownerId,
    ...form,
   });
   setForm({name:"",email:"",phone:"",startDate:"",endDate:"",message:""});
   setStatus("Viestisi on lähetetty mökin omistajalle.");
  }catch(err){
   console.error(err);
   setStatus("Viestin lähetys epäonnistui. Yritä hetken kuluttua uudelleen.");
  }
 }

 return <main className="mx-auto max-w-[1400px] px-5 py-8"><div className="grid gap-3 md:grid-cols-[2fr_1fr]"><img src={imgs[active]} className="h-[520px] w-full rounded-2xl object-cover"/><div className="grid grid-cols-2 gap-3">{imgs.slice(0,4).map((img,i)=><button key={i} onClick={()=>setActive(i)}><img src={img} className="h-[254px] w-full rounded-2xl object-cover"/></button>)}</div></div><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]"><article><p className="font-black uppercase tracking-widest text-forest">{c.city}</p><div className="flex flex-wrap items-start justify-between gap-4"><h1 className="mt-2 text-5xl font-black">{c.name}</h1><p className="text-3xl font-black">{c.price} € <span className="text-base font-normal">/ yö</span></p></div><div className="mt-5 flex flex-wrap gap-5 text-slate-600"><span className="flex gap-2"><MapPin/>{c.city}</span><span className="flex gap-2"><Users/>{c.guests} henkilöä</span></div><p className="mt-8 whitespace-pre-line text-lg leading-8">{c.description}</p><h2 className="mt-10 text-2xl font-black">Varustelu</h2><div className="mt-4 grid grid-cols-2 gap-3">{amenities.map(a=><div key={a} className="rounded-xl bg-cream p-4 font-semibold">✓ {a}</div>)}</div><h2 className="mt-10 text-2xl font-black">Sijainti</h2><div className="mt-4 h-72 overflow-hidden rounded-2xl bg-slate-100">{c.latitude&&c.longitude?<iframe title="Mökin sijainti" className="h-full w-full" src={`https://www.openstreetmap.org/export/embed.html?bbox=${c.longitude-.08}%2C${c.latitude-.05}%2C${c.longitude+.08}%2C${c.latitude+.05}&layer=mapnik&marker=${c.latitude}%2C${c.longitude}`}/>:<div className="grid h-full place-items-center">Sijainti tarkentuu myöhemmin</div>}</div></article><aside className="space-y-5"><AvailabilityCalendar ranges={c.blockedRanges}/><form onSubmit={submitInquiry} className="rounded-2xl border p-6 shadow-lg"><h2 className="flex items-center gap-2 text-2xl font-black"><MessageSquare/> Ota yhteyttä</h2><p className="mt-2 text-sm text-slate-600">Sähköpostiosoite ei näy julkisesti. Viesti välitetään omistajan hallintapaneeliin.</p><div className="mt-4 grid grid-cols-2 gap-3"><label className="text-sm font-bold">Saapuminen<input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} className="mt-1 w-full rounded-xl border p-3 font-normal"/></label><label className="text-sm font-bold">Lähtö<input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} className="mt-1 w-full rounded-xl border p-3 font-normal"/></label></div><input required placeholder="Nimi" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-3 w-full rounded-xl border p-3"/><input required type="email" placeholder="Sähköposti" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-3 w-full rounded-xl border p-3"/><input placeholder="Puhelinnumero (valinnainen)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="mt-3 w-full rounded-xl border p-3"/><textarea required placeholder="Viesti omistajalle" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="mt-3 min-h-28 w-full rounded-xl border p-3"/><button disabled={status==="Lähetetään..."} className="mt-4 block w-full rounded-xl bg-forest p-4 text-center font-black text-white disabled:opacity-60">{status==="Lähetetään..."?"Lähetetään…":"Lähetä viesti"}</button>{status&&status!=="Lähetetään..."&&<p className="mt-3 text-sm font-semibold">{status}</p>}{c.phone&&<div className="mt-5 border-t pt-5">{showPhone?<a href={`tel:${c.phone}`} className="flex items-center justify-center gap-2 rounded-xl border p-3 font-bold text-forest"><Phone size={18}/>{c.phone}</a>:<button type="button" onClick={()=>setShowPhone(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border p-3 font-bold"><Phone size={18}/>Näytä puhelinnumero</button>}</div>}</form></aside></div></main>
}
