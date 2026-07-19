"use client";
import Link from "next/link";
import { Home, LogIn, LogOut, Plus } from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import AuthDialog from "./AuthDialog";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  return <>
    <header className="sticky top-0 z-[1000] border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center gap-8 px-5">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black"><Home className="text-forest"/> mökkipaikka.fi</Link>
        <nav className="hidden gap-7 md:flex"><Link href="/">Hae mökkiä</Link><Link href="/hallinta">Hallintapaneeli</Link></nav>
        <div className="ml-auto flex items-center gap-3">
          {user ? <><Link href="/hallinta" className="hidden font-semibold sm:block">Oma tili</Link><button onClick={()=>signOut(auth)} className="rounded-xl border px-4 py-3"><LogOut size={18}/></button></> : <button onClick={()=>setAuthOpen(true)} className="flex items-center gap-2 font-semibold"><LogIn size={18}/> Kirjaudu</button>}
          <Link href="/hallinta" className="flex items-center gap-2 rounded-xl bg-forest px-4 py-3 font-bold text-white"><Plus size={18}/> Ilmoita mökkisi</Link>
        </div>
      </div>
    </header>
    <AuthDialog open={authOpen} onClose={()=>setAuthOpen(false)} />
  </>;
}
