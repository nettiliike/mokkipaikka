"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthDialog({open,onClose}:{open:boolean;onClose:()=>void}){
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [mode,setMode]=useState<"login"|"signup">("login"); const [error,setError]=useState("");
 if(!open)return null;
 async function submit(e:React.FormEvent){e.preventDefault();setError("");try{mode==="login"?await signInWithEmailAndPassword(auth,email,password):await createUserWithEmailAndPassword(auth,email,password);onClose();}catch(err:any){setError(err.message||"Kirjautuminen epäonnistui");}}
 return <div className="fixed inset-0 z-[2000] grid place-items-center bg-black/45 p-4"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"><h2 className="text-2xl font-black">{mode==="login"?"Kirjaudu sisään":"Luo tunnus"}</h2><input className="mt-5 w-full rounded-xl border p-3" type="email" placeholder="Sähköposti" value={email} onChange={e=>setEmail(e.target.value)} required/><input className="mt-3 w-full rounded-xl border p-3" type="password" placeholder="Salasana" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} required/>{error&&<p className="mt-3 text-sm text-red-600">{error}</p>}<button className="mt-5 w-full rounded-xl bg-forest p-3 font-bold text-white">Jatka</button><button type="button" onClick={()=>setMode(mode==="login"?"signup":"login")} className="mt-3 w-full text-sm text-forest">{mode==="login"?"Luo uusi tunnus":"Minulla on jo tunnus"}</button><button type="button" onClick={onClose} className="mt-2 w-full text-sm text-slate-500">Sulje</button></form></div>
}
