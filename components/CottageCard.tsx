import Link from "next/link";
import { Users, MapPin } from "lucide-react";
import type { Cottage } from "@/lib/types";
export default function CottageCard({cottage}:{cottage:Cottage}){
 return <Link href={`/mokki/${cottage.id}`} className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><img src={cottage.image||"/hero.jpg"} className="h-56 w-full object-cover" alt={cottage.name}/><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-xl font-black">{cottage.name}</h3><strong className="whitespace-nowrap text-lg">{cottage.price} €<span className="text-sm font-normal"> / yö</span></strong></div><p className="mt-2 flex items-center gap-1 text-slate-600"><MapPin size={16}/>{cottage.city}</p><p className="mt-2 flex items-center gap-1 text-sm text-slate-600"><Users size={16}/>{cottage.guests} henkilöä</p></div></Link>
}
