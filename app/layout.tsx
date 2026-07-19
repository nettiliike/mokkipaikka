import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mökkipaikka.fi – löydä vapaa mökki",
  description: "Suomalainen mökkihakupalvelu, jossa otat yhteyttä omistajaan suoraan.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fi"><body>{children}</body></html>;
}
