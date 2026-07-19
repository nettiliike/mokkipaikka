import Header from "@/components/Header";
import CottageDetailClient from "@/components/CottageDetailClient";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <><Header/><CottageDetailClient id={id}/></>}
