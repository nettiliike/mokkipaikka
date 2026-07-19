"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { Cottage } from "@/lib/types";
import { useEffect } from "react";

const icon = L.divIcon({className:"",html:'<div style="background:#21843a;color:white;padding:8px 10px;border-radius:999px;font-weight:800;border:3px solid white;box-shadow:0 2px 12px #0004">€</div>',iconSize:[36,36]});
function Fit({items}:{items:Cottage[]}){const map=useMap();useEffect(()=>{const pts=items.filter(c=>c.latitude&&c.longitude).map(c=>[c.latitude!,c.longitude!] as [number,number]);if(pts.length)map.fitBounds(pts,{padding:[35,35],maxZoom:9});},[items,map]);return null;}
export default function MapClient({items}:{items:Cottage[]}){
 const plotted=items.filter(c=>c.latitude&&c.longitude);
 return <MapContainer center={[64.2,26]} zoom={5} scrollWheelZoom className="rounded-2xl"><TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><Fit items={plotted}/>{plotted.map(c=><Marker key={c.id} position={[c.latitude!,c.longitude!]} icon={icon}><Popup><div className="w-48"><img src={c.image||"/hero.jpg"} className="mb-2 h-24 w-full rounded-lg object-cover"/><strong>{c.name}</strong><p>{c.price} € / yö</p><Link className="font-bold text-green-700" href={`/mokki/${c.id}`}>Avaa ilmoitus</Link></div></Popup></Marker>)}</MapContainer>
}
