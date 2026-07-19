# Mökkipaikka.fi – Next.js v1.0

Mukana:
- reaaliaikainen mökkilista + OpenStreetMap-kartta
- alue-, päivä- ja henkilömäärähaku
- erillinen mökin oma sivu, kuvagalleria, kartta ja varauskalenteri
- kirjautuminen Firebase Authenticationilla
- omistajan hallintapaneeli: lisää, muokkaa, piilota ja poista ilmoitus
- varattujen ajanjaksojen hallinta
- Firebase Firestore -integraatio

## Paikallinen testaus
1. Asenna Node.js 20 tai uudempi.
2. Avaa projektikansio terminaalissa.
3. Suorita `npm install`.
4. Suorita `npm run dev`.
5. Avaa http://localhost:3000

## Julkaisu Netlifyyn
Tämä on Next.js-projekti, joten sitä ei julkaista enää vetämällä pelkkää index.html-tiedostoa.

1. Vie kansio GitHubiin.
2. Netlify: Add new site → Import an existing project.
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Lisää Environment variables -kohtaan `.env.local`-tiedoston NEXT_PUBLIC_... arvot.

Vercel on vielä helpompi: Import Project → valitse GitHub-repo → Deploy.

## Vanhan Firestore-datan yhteensopivuus
Nykyiset `cottages`-dokumentit toimivat. Karttaa varten ilmoitukseen lisätään `latitude` ja `longitude`. Hallintapaneeli hakee koordinaatit automaattisesti kaupungin perusteella seuraavan tallennuksen yhteydessä.

## Huomio kuviin
Nykyinen versio lukee vanhat Firestoreen tallennetut data-URL-kuvat. Uusia kuvia voi tässä versiossa syöttää URL-osoitteena. Tuotantoversiossa kuvat kannattaa siirtää Firebase Storageen tai Cloudinaryyn, koska Firestore-dokumentin kokoraja tulee nopeasti vastaan.
