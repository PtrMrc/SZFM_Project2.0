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
## Követelmények
 - Kvízek kezelése:
   - Elindítás, leállítás
   - Feleletválasztós/Igaz-Hamis
- Játékmenet:
  - Játékosok indítják a kvízt, valós időben versenyeznek
  - Kérdések időzítéssel jelennek meg
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
