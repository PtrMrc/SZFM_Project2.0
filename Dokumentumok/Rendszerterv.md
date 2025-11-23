# Rendszerterv

## A rendszer célja
- Szórakoztatás
- Tanulás játék közben
- Alapműveltség fejlesztése
- Versenyszellem kialakítása

## Projektterv
- 4 fejlesztő
- Rendelkezésre álló időtartam: 6 hét
- Ütemterv: Trello-ban vezetve
- Mérföldkövek:
  - kezdőlap
  - játékos nevének bevitele
  - kérdések megjelenítése sorban
  - pontrendszer kialakítása
  - visszaszámlálás kérdésenként
  - ranglista kezelése
  - ranglista megjelenítése
  - kieső játékosok megjelenítése
  - tesztelés

## Üzleti folyamatok modellje
- Üzleti szereplők:
   - Játékos
      - Belép a játékba felhasználónév és jelszó megadásával
      - Válaszol a feltett kérdésekre a rendelkezésre álló időkereten belül
      - Azonnali visszajelzést kap a válasz helyességéről és pontszámáról
      - Ha kiesik választhat, hogy tovább nézi a játékot vagy kilép
      - A játék végén megtekintheti a ranglistát
   - Rendszer (Battle Royale Kvízjáték)
      - API hívással megjeleníti a kérdéseket
      - Időkeretet szab (pl. 20 másodperc)
      - Pontszámot számol a válasz helyessége és gyorsasága alapján
      - Nyilvántartja az eredményeket, és ranglistát készít
      - A kiesőket/továbbjutókat számontartja
- Üzleti folyamatok:
  - Játék indítása
    - Játékos elindítja a kvízt
    - Kóddal csatlakozhat egy szobához vagy kereshet véletlenszerűen meccset
    - Rendszer megjeleníti az első kérdést minden résztvevőnek
  - Kérdések megválaszolása
    - Rendszer megjelenít egy kérdést 4 válaszlehetőséggel
    - Játékos kiválasztja a választ 20 másodpercen belül
    - Rendszer azonnali visszajelzést ad (helyes/nem helyes, pontszám, kiesés/továbbjutás)
    - A folyamat ismétlődik amíg 1 győztes játékos marad
  - Pontozás és ranglista
    - A rendszer minden játékoshoz hozzárendeli az összpontszámot
    - Játék végén rangsort készít (név + pontszám)
    - Megjeleníti a legjobb teljesítményt nyújtókat
- Üzleti entitások:
  - Kérdés
    - Attribútumok: szöveg, válaszlehetőségek, helyes válasz
    - Forrás: API hívások
  - Játékos
    - Attribútumok: név, jelszó, adott játékban elért pontszám, válaszok
  - Pontszám
    - Attribútumok: helyesség (igen/nem), válaszidő, kiszámított pont
  - Játék (kvíz)
    - Attribútumok: kérdések, időkeret, résztvevők listája, ranglista
  - Ranglista
    - Attribútumok: játékos neve, összpontszám, sorrend
   
<img width="371" height="429" alt="image" src="https://github.com/user-attachments/assets/987a257d-4b59-4ba2-b69b-931ee1623f61" />

<img width="1023" height="338" alt="image" src="https://github.com/user-attachments/assets/2082820a-b3a9-4901-92df-c6d8adb188a5" />

<img width="927" height="393" alt="image" src="https://github.com/user-attachments/assets/ad4e7e97-bc42-4b98-8572-c0833a99f7b9" />
        
## Követelmények
 - Kvízek kezelése:
   - Elindítás, leállítás
   - Feleletválasztós/Igaz-Hamis
- Játékmenet:
  - Játékosok indítják a kvízt, valós időben versenyeznek
  - Kérdések időzítéssel jelennek meg
  - Kérdések között "szerencsekerék" animáció
  - Automatikus pontozás a válaszok gyorsasága és helyessége alapján
- Eredmények megjelenítése:
  - Kvíz végén összesítés (helyes válaszok száma, pontszám)
- Felhasználói élmény:
  - Telefonon is használható
  - Színes, játékos grafika a motiváció fenntartására

## Fizikai környezet
- Használandó technológiák: Python, Flask, JSON, HTML, CSS, Javascript stb.
- Webes felületre, mobilon is reszponzívan megjelenítve

## Funkcionális terv
- Rendszerszereplők:
  -  Játékos: elindítja a játékot, megoldja a kérdéseket
- Rendszerhasználati esetek és lefutásaik
- Határ osztályok
- Menühierarchiák:
  -  Kezdőképernyő:
      - Név, jelszó bevitel
      - Játék indítása
  -  Kérdés képernyő:
      - Kérdés + válaszlehetőségek
      - Időzítő
      - Ideiglenes pontszám
  -  Eredmény képernyő:
      - Helyes válaszok száma
      - Pontszám
      - Ranglista

## 7. Tesztelési Terv

A tesztelés fókuszában a valós idejű adatátvitel (szinkronizáció) és a speciális játéklogika áll.

* **Tesztelési szintek:**
    * **Egységtesztek (Unit):** A backend logika ellenőrzése (pl. pontszámítás, kiesés vs. továbbjutás eldöntése).
    * **Integrációs tesztek:** A kliens és szerver közötti Socket.io kommunikáció vizsgálata (megjelenik-e a kérdés mindenkinél egyszerre?).
    * **Terheléses teszt:** A rendszer stabilitásának ellenőrzése 20+ párhuzamos játékos esetén.

* **Kiemelt tesztesetek:**
    1. **Jogosultság:** Az első belépő valóban megkapja-e a *Host* (indító) jogot, a többiek pedig a *Player* státuszt.
    2. **Játékmenet:** A külső API-ból érkező kérdés és a 4 válaszopció helyes megjelenítése.
    3. **Szabályrendszer:** A **Kegyelmi szabály** működése (ha mindenki ront, senki nem esik ki) és a normál kiesés (rossz válasz -> néző mód) ellenőrzése.
    4. **AI Mód:** Az 1v1 módban az AI válaszadási idejének és találati arányának ellenőrzése a választott nehézségi szinten.

* **Eszközök:** Jest (logika), Postman (API), Socket.io-client (hálózati szimuláció).

## 8. Karbantartási Terv

A rendszer élesítése utáni legfontosabb feladat a külső függőségek kezelése és a stabilitás megőrzése.

* **Külső API felügyelet (Kritikus):** Mivel a kérdések az *OpenTrivia Database*-ből jönnek, folyamatosan figyelni kell az API állapotát. Ha a szolgáltató változtat az adatstruktúrán, a backend kódot azonnal hozzá kell igazítani (adaptív karbantartás).
* **Vészhelyzeti terv (Fallback):** Fel kell készülni az API leállására. Ilyen esetre a rendszernek tartalmaznia kell egy "Offline módot" egy kisebb, saját tárolt kérdéscsomaggal, hogy a játék ne álljon meg.
* **Hibajavítás:** A felhasználók által jelentett technikai hibák (pl. UI szétcsúszás mobilon, beragadó időzítő) azonnali javítása.
* **Továbbfejlesztés:** A v2.0-ra tervezett funkciók (profilrendszer, statisztikák mentése, saját témák) ütemezett beépítése a stabil alaprendszerbe.



