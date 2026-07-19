"use client";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import type { Cottage } from "@/lib/types";
import { getOwnerCottages, removeCottage, saveCottage } from "@/lib/cottages";
import { uploadCottageImages } from "@/lib/uploads";
import Link from "next/link";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";

const empty=(uid:string,email:string):Cottage=>({id:crypto.randomUUID(),name:"",city:"",price:100,guests:2,description:"",ownerId:uid,email,images:[],amenities:{sauna:true},blockedRanges:[],published:true});
export default function DashboardClient(){
 const [user,setUser]=useState<User|null>(null);const [items,setItems]=useState<Cottage[]>([]);const [editing,setEditing]=useState<Cottage|null>(null);const [message,setMessage]=useState("");const [imageFiles,setImageFiles]=useState<File[]>([]);
 useEffect(()=>onAuthStateChanged(auth,u=>{setUser(u);if(u)getOwnerCottages(u.uid).then(setItems)}),[]);
 async function submit(e:React.FormEvent){
  e.preventDefault();
  if(!editing||!user)return;
  setMessage("Tallennetaan...");

  try{
   let lat=editing.latitude,lon=editing.longitude;

   // Paikkatietohaku ei saa estää tallennusta loputtomasti.
   if((lat == null || lon == null)&&editing.city){
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),6000);
    try{
     const r=await fetch(`/api/geocode?q=${encodeURIComponent(editing.city)}`,{signal:controller.signal});
     if(r.ok){
      const g=await r.json();
      lat=g.latitude??lat;
      lon=g.longitude??lon;
     }
    }catch{
     // Tiedot tallennetaan myös silloin, jos paikkatietohaku epäonnistuu.
    }finally{
     clearTimeout(timeout);
    }
   }

   let uploadedImages:string[]=[];
   if(imageFiles.length){
    uploadedImages=await uploadCottageImages(user.uid,editing.id,imageFiles);
   }

   const allImages=[...(editing.images||[]),...uploadedImages];
   const data={
    ...editing,
    image:allImages[0]||editing.image||"",
    images:allImages,
    latitude:lat,
    longitude:lon,
    ownerId:user.uid,
    email:editing.email||user.email||""
   };

   await saveCottage(data);
   setItems(prev=>{
    const exists=prev.some(x=>x.id===data.id);
    return exists?prev.map(x=>x.id===data.id?data:x):[data,...prev];
   });
   setMessage("Tallennettu");
   setImageFiles([]);
   setEditing(null);
  }catch(err){
   console.error("Mökin tallennus epäonnistui:",err);
   const fallback="Tallennus epäonnistui. Tarkista yhteys ja yritä uudelleen.";
   setMessage(err instanceof Error && err.message ? `Virhe: ${err.message}` : fallback);
  }
 }
 if(!user)return <div className="mx-auto max-w-3xl p-10 text-center"><h1 className="text-4xl font-black">Hallintapaneeli</h1><p className="mt-4">Kirjaudu ensin sisään yläreunan painikkeesta.</p></div>;
 return <main className="mx-auto max-w-[1300px] px-5 py-10"><div className="flex items-center justify-between"><div><h1 className="text-4xl font-black">Hallintapaneeli</h1><p className="text-slate-600">Hallitse mökkejä ja kalentereita.</p></div><button onClick={()=>{setImageFiles([]);setEditing(empty(user.uid,user.email||""))}} className="flex gap-2 rounded-xl bg-forest px-5 py-4 font-bold text-white"><Plus/> Lisää mökki</button></div><div className="mt-8 grid gap-5">{items.map(c=><div key={c.id} className="flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:items-center"><img src={c.image||c.images?.[0]||"/hero.jpg"} className="h-32 w-full rounded-xl object-cover md:w-48"/><div className="flex-1"><h2 className="text-2xl font-black">{c.name}</h2><p>{c.city} · {c.price} €/yö</p><span className={`mt-2 inline-block rounded-full px-3 py-1 text-sm ${c.published?"bg-green-100 text-green-700":"bg-slate-200"}`}>{c.published?"Julkaistu":"Piilotettu"}</span></div><div className="flex flex-wrap gap-2"><Link href={`/mokki/${c.id}`} className="rounded-lg border px-4 py-3">Näytä</Link><button onClick={()=>{setImageFiles([]);setEditing(c)}} className="flex gap-2 rounded-lg border px-4 py-3"><Pencil size={18}/>Muokkaa</button><button onClick={()=>{setImageFiles([]);setEditing(c)}} className="flex gap-2 rounded-lg border px-4 py-3"><CalendarDays size={18}/>Kalenteri</button><button onClick={async()=>{if(confirm("Poistetaanko ilmoitus?")){await removeCottage(c.id);setItems(items.filter(x=>x.id!==c.id))}}} className="rounded-lg border px-4 py-3 text-red-600"><Trash2 size={18}/></button></div></div>)}</div>{editing&&<div className="fixed inset-0 z-[1500] overflow-y-auto bg-black/45 p-4"><form onSubmit={submit} className="mx-auto my-10 max-w-3xl rounded-3xl bg-white p-7"><div className="flex justify-between"><h2 className="text-3xl font-black">{items.some(x=>x.id===editing.id)?"Muokkaa mökkiä":"Lisää mökki"}</h2><button type="button" onClick={()=>{setImageFiles([]);setEditing(null)}} className="text-2xl">×</button></div><div className="mt-6 grid gap-4 md:grid-cols-2">
<label className="grid gap-1 text-sm font-bold">Mökin nimi<input className="rounded-xl border p-3 font-normal" placeholder="Esim. Tahkonsydän" value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})} required/></label>
<label className="grid gap-1 text-sm font-bold">Paikkakunta<input className="rounded-xl border p-3 font-normal" placeholder="Esim. Tahko" value={editing.city} onChange={e=>setEditing({...editing,city:e.target.value})} required/></label>
<label className="grid gap-1 text-sm font-bold">Hinta / yö (€)<input className="rounded-xl border p-3 font-normal" type="number" min="0" step="1" placeholder="Esim. 92" value={editing.price} onChange={e=>setEditing({...editing,price:Number(e.target.value)})}/></label>
<label className="grid gap-1 text-sm font-bold">Majoittujien enimmäismäärä<input className="rounded-xl border p-3 font-normal" type="number" min="1" step="1" placeholder="Esim. 4" value={editing.guests} onChange={e=>setEditing({...editing,guests:Number(e.target.value)})}/></label>
<label className="grid gap-1 text-sm font-bold">Puhelinnumero<input className="rounded-xl border p-3 font-normal" placeholder="Esim. 040 123 4567" value={editing.phone||""} onChange={e=>setEditing({...editing,phone:e.target.value})}/></label>
<label className="grid gap-1 text-sm font-bold">Lataa kuvat koneelta<input className="rounded-xl border p-3 font-normal" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>setImageFiles(Array.from(e.target.files||[]).slice(0,3))}/><span className="font-normal text-slate-500">Voit valita enintään 3 JPG-, PNG- tai WebP-kuvaa. Kuvat pakataan automaattisesti ja tallennetaan Firestoreen.</span></label>
</div>
{(editing.images||[]).length>0&&<div className="mt-4"><p className="mb-2 text-sm font-bold">Nykyiset kuvat</p><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{(editing.images||[]).map((url,i)=><div key={url+i} className="relative"><img src={url} className="h-28 w-full rounded-xl object-cover"/><button type="button" onClick={()=>{const imgs=(editing.images||[]).filter((_,j)=>j!==i);setEditing({...editing,images:imgs,image:imgs[0]||""})}} className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-red-600">Poista</button></div>)}</div></div>}
{imageFiles.length>0&&<p className="mt-3 text-sm text-slate-600">Valittu {imageFiles.length} kuvaa ladattavaksi tallennuksen yhteydessä.</p>}<textarea className="mt-4 min-h-40 w-full rounded-xl border p-3" placeholder="Kuvaus" value={editing.description} onChange={e=>setEditing({...editing,description:e.target.value})}/><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{([['sauna','Sauna'],['beach','Oma ranta'],['hotTub','Palju'],['pets','Lemmikit'],['boat','Vene'],['electricity','Sähköt'],['drinkingWater','Juomavesi'],['indoorToilet','Sisä-WC']] as const).map(([key,label])=><label key={key} className="flex gap-2 rounded-xl bg-cream p-3"><input type="checkbox" checked={!!editing.amenities?.[key]} onChange={e=>setEditing({...editing,amenities:{...editing.amenities,[key]:e.target.checked}})}/>{label}</label>)}</div><label className="mt-5 flex gap-2"><input type="checkbox" checked={editing.published!==false} onChange={e=>setEditing({...editing,published:e.target.checked})}/> Ilmoitus näkyy julkisesti</label><div className="mt-5 rounded-xl border p-4"><h3 className="font-black">Varatut ajanjaksot</h3>{(editing.blockedRanges||[]).map((r,i)=><div key={i} className="mt-2 flex gap-2"><input type="date" value={r.start} onChange={e=>{const a=[...(editing.blockedRanges||[])];a[i]={...a[i],start:e.target.value};setEditing({...editing,blockedRanges:a})}}/><input type="date" value={r.end} onChange={e=>{const a=[...(editing.blockedRanges||[])];a[i]={...a[i],end:e.target.value};setEditing({...editing,blockedRanges:a})}}/><button type="button" onClick={()=>setEditing({...editing,blockedRanges:(editing.blockedRanges||[]).filter((_,j)=>j!==i)})}>Poista</button></div>)}<button type="button" onClick={()=>setEditing({...editing,blockedRanges:[...(editing.blockedRanges||[]),{start:"",end:""}]})} className="mt-3 text-forest">+ Lisää varattu ajanjakso</button></div><button disabled={message==="Tallennetaan..."} className="mt-6 w-full rounded-xl bg-forest p-4 font-black text-white disabled:cursor-wait disabled:opacity-60">{message==="Tallennetaan..."?"Tallennetaan…":"Tallenna"}</button>{message&&<p className={`mt-3 text-center ${message.startsWith("Virhe:")?"font-bold text-red-600":"text-slate-700"}`}>{message}</p>}</form></div>}</main>
}
