# Követelmény-specifikáció

## 1. Áttekintés

A Quiz Royale egy online, valós idejű, többjátékos kvízjáték, amelyben a játékosok egymással versenyeznek általános műveltségi kérdésekben.  
A játék működése Battle Royale alapú: minden kérdés után a rosszul válaszoló játékosok kiesnek, a helyesen válaszolók pedig továbbjutnak a következő körbe, egészen addig, amíg csak egy győztes marad.  

A rendszer Flask (Python) alapú backendből és React.js frontendből épül fel.  
A két oldal közti valós idejű kommunikációt a Socket.IO biztosítja.  
A kérdések az Open Trivia API-ból érkeznek, amely több kategóriában kínál tematikus kérdéseket (pl. Tudomány, Filmek, Sport, Történelem).  

A játék webes felületen érhető el, és reszponzív kialakításának köszönhetően számítógépen és mobilon egyaránt kényelmesen játszható.

---

## 2. Jelenlegi helyzet

A piacon elérhető kvízjátékok többsége (pl. Kahoot, Quizizz) elsősorban oktatási célokat szolgál, és nem nyújt valós idejű, versenyszerű élményt.  
A játékosok jellemzően nem egymás ellen, hanem egyedül játszanak, és az eredmények csak a játék végén derülnek ki.  

A Quiz Royale ezt a hiányt pótolja:  
- gyors, dinamikus, valós idejű kvízélményt kínál,  
- egyszerre több játékost kapcsol össze,  
- és a kieséses rendszernek köszönhetően izgalmasabb, mint a hagyományos kvízek.  

A rendszer célja, hogy közösségi, kompetitív és szórakoztató formában nyújtson általános műveltségi kihívást a felhasználóknak.

---

## 3. Vágyálom rendszer

A 100%-ban ideális rendszer a következő funkciókkal rendelkezne:

- A játék több platformon (web, mobil, később akár desktop app) is elérhető lenne.  
- A játékosok választhatnának tematikus játékmódot (pl. filmek, történelem, sport).  
- A játék AI-alapú kérdéskiválasztást és dinamikus nehézségszinteket kínálna.  
- A játékosok saját profilokat hozhatnának létre, statisztikákkal és győzelmi arányokkal.  
- Későbbi fejlesztésben megvalósulhatna a pontszám-alapú játékmód, nem csak kieséses forma.  
- Lehetőség lenne baráti szobák létrehozására meghívóval.  
- Az eredményekből globális toplista készülne.

---

## 4. Követelménylista

| Funkciócsoport | Azonosító | Funkció | Verzió | Leírás |
|----------------|------------|----------|---------|---------|
| **Szobakezelés** | K1 | Szoba létrehozása | 1.0 | A host játékos új szobát hozhat létre egyedi kóddal. |
| **Szobakezelés** | K2 | Csatlakozás szobához | 1.0 | A játékos a megadott szobakód és név alapján beléphet a játékba. |
| **Lobby** | K3 | Lobby megjelenítés | 1.0 | A játékosok listája valós időben frissül, és megjelenik a host neve. |
| **Játékmenet** | K4 | Játék indítása | 1.0 | A host elindítja a játékot, ezután mindenki egyszerre kap kérdést. |
| **Játékmenet** | K5 | Kérdéslekérés (Open Trivia API) | 1.0 | A rendszer tematikus kérdéseket tölt be az Open Trivia API-ból. |
| **Játékmenet** | K6 | Időzített válaszadás | 1.0 | A játékosok 10 másodperc alatt válaszolhatnak. |
| **Játékmenet** | K7 | Válaszok kiértékelése | 1.0 | A rendszer automatikusan ellenőrzi a válaszokat és továbbviszi a helyeseket. |
| **Játékmenet** | K8 | Kiesés logika | 1.0 | A hibásan válaszolók kiesnek, és erről valós idejű visszajelzést kapnak. |
| **Játékmenet** | K9 | Új kör indítása | 1.0 | A helyes válaszadók automatikusan új kérdést kapnak. |
| **Játékmenet** | K10 | Játék vége | 1.0 | Ha csak egy játékos marad, ő lesz a győztes. |
| **Eredmény** | K11 | Ranglista generálás | 1.0 | A játék végén megjelenik a győztes és a kiesési sorrend. |
| **Eredmény** | K12 | ResultScreen megjelenítés | 1.0 | A játék végi animált eredményképernyő jeleníti meg a végeredményt. |
| **Fejlesztési terv** | K13 | Tematikus játékmód | 2.0 | A játékos választhat kategóriát a kérdésekhez. |
| **Fejlesztési terv** | K14 | Profilrendszer | 2.0 | A játékos statisztikái és győzelmei mentésre kerülnek. |

---

## 5. Jelenlegi üzleti folyamatok modellje

A hagyományos kvízjátékokban a játékosok egymástól függetlenül játszanak.  
A kérdéseket mindenki külön kapja meg, és az eredmények utólag, nem valós időben derülnek ki.  

Ez kevésbé izgalmas, nem ösztönöz közösségi interakcióra, és hiányzik belőle a versengés érzése.  
A felhasználók nem érzik a közvetlen kapcsolatot más játékosokkal, ezért hamar elveszítik az érdeklődésüket.

---

## 6. Igényelt üzleti folyamatok

A Quiz Royale célja ennek a folyamatnak a modernizálása, a következő módon:

1. A játékos egy szobába csatlakozik.  
2. A host elindítja a játékot.  
3. Minden játékos egyszerre kapja meg a kérdést.  
4. A válaszadásra meghatározott idő áll rendelkezésre (pl. 10 másodperc).  
5. A hibásan válaszolók kiesnek.  
6. A helyesen válaszolók új kérdést kapnak.  
7. Az utolsó bent maradó játékos megnyeri a játékot.  
8. A végén megjelenik a teljes ranglista és a győztes neve.

---

## 7. Szabadriport: Webalapú Kvízrendszer (Battle Royale Koncepció)

### 1. Vezetői Összefoglaló

Az alkalmazás célja egy **modern, webalapú kvízrendszer** megvalósítása, amely a lexikális tudást ötvözi a szerencsével és a stratégiai játékelemekkel. A szoftver alapvető koncepciója a **„kieséses” (Battle Royale) rendszer**, ahol a játékosoknak nem pontokat kell gyűjteniük, hanem minél tovább versenyben kell maradniuk.


### 2. A Rendszer Felépítése és a Belépési Folyamat

Az alkalmazás indításakor a felhasználót egy letisztult **Főmenü** fogadja. A rendszer **nem igényel előzetes regisztrációt**, a belépés gyors és akadálymentes.

A felhasználó két opció közül választhat:
* **Multiplayer (Többjátékos mód):** Valós idejű küzdelem más játékosok ellen.
* **Player vs AI (Egyjátékos mód):** Küzdelem a gép ellen, testreszabható paraméterekkel.

### 3. Multiplayer Mód Működése

### Szobakezelés és Jogosultságok

A többjátékos módba lépve a felhasználónak egy **Nevet** és egy **Szobakódot** kell megadnia. A rendszer a háttérben dinamikusan kezeli a szobákat:

| Jogosultság | Leírás |
| :--- | :--- |
| **Host (Játékmester)** | Az a felhasználó, aki **elsőként** lép be egy adott szobakóddal. Kizárólag ő rendelkezik „Start” gombbal a játék elindításához. |
| **Játékosok** | Minden további csatlakozó, aki ugyanazt a kódot adja meg. Automatikusan a váróterembe (**Lobby**) kerülnek. |

**Szinkronizáció:** A játék indításakor a rendszer minden csatlakoztatott eszközt (Host és Játékosok) egyszerre léptet át a játék felületre.

### A Játékmenet (Core Loop)

A játék körökre osztott, minden kör azonos logikát követ:

1.  **Témaválasztás Szerencsekerékkel:**
    * A kör elején megjelenik egy animált szerencsekerék.
    * A pörgetés dönti el a következő kérdés kategóriáját (pl. Történelem, Tudomány, Filmek), biztosítva a **véletlenszerűséget** és az esélyegyenlőséget.
2.  **Automatikus Tartalomgenerálás:**
    * A téma kiválasztása után a rendszer **API hívást** indít az **OpenTrivia Database** felé.
    * A kérdés és a válaszlehetőségek valós időben érkeznek.
3.  **Válaszadás:**
    * A kérdés minden játékosnál egyszerre jelenik meg.
    * **Időkorlát:** Fix **20 másodperc**.
4.  **Segítség:**
    * Minden játékosnak meccsenként **1 db „Felezés”** lehetősége van.
    * Aktiválása levesz két rossz választ a négyből, 50%-ra növelve a találati esélyt.

### Kiesési Logika és a „Kegyelmi Szabály”

A válaszadási idő lejárta után a rendszer kiértékeli az eredményeket:

* **Továbbjutás:** Aki **helyesen** válaszolt, versenyben marad.
* **Kiesés:** Aki **rosszul** válaszolt, kiesik a játékból.
* **Kegyelmi Szabály:**
    * Speciális eset, ha a kör végén **senki sem** találja el a helyes választ.
    * Ekkor a rendszer **nem ejt ki senkit**, mindenki kap egy új esélyt, és a játék új pörgetéssel folytatódik.
* **Győzelem:** A játék addig tart, amíg **egyetlen játékos marad talpon**.

### 4. Player vs AI Mód Működése

Ez a mód lehetőséget ad a **gyakorlásra** és a gyors játékra társaság nélkül. A mechanika alapjaiban megegyezik a többjátékos móddal.

### Beállítási Lehetőségek (Konfigurációs Felület)

A játék indítása előtt a játékos testreszabhatja a kihívást:

* **Kérdések száma:**
    * A mérkőzés maximális hossza állítható (5-ös lépésközökkel: pl. 5, 10, 15, 20 kérdés).
* **AI Pontossága:**
    * Állítható az ellenfél „okossága” (pl. Könnyű, Közepes, Nehéz).
    * Ez a háttérben azt befolyásolja, hogy a gép mekkora **valószínűséggel** választja ki a helyes választ.

### Játékmenet AI ellen

A játékos és az AI párhuzamosan játszik.
* Aki helyesen válaszol pontot kap, ezután továbblépnek a következő kérdére.

### 5. Zárófolyamatok és Visszajelzés

A játék lezárása után (Multiplayer vagy AI mód) a rendszer egy **Összesített Ranglistát** jelenít meg.

* A lista tartalmazza az összes résztvevő nevét (vagy az AI-t).
* A győztes neve kiemelt vizuális effektekkel jelenik meg.

Ez a struktúra biztosítja, hogy az alkalmazás mind **szórakoztatási** (party game), mind **edukációs** (gyakorlás) célra kiválóan alkalmas legyen, minimális adminisztrációs teher mellett.

---

## 8. Fogalomtár

| Fogalom | Meghatározás |
|----------|---------------|
| **Host** | A szobát létrehozó játékos, aki elindítja a játékot. |
| **Lobby** | A játék előtti váróképernyő, ahol a játékosok láthatják egymást. |
| **Round (Kör)** | Egy kérdés-válasz ciklus, amely végén kiesnek a hibás játékosok. |
| **Socket.IO** | Valós idejű kommunikációt biztosító technológia a kliens és a szerver között. |
| **Open Trivia API** | Nyílt adatforrás, amely tematikusan gyűjtött kvízkérdéseket biztosít. |
| **Battle Royale** | Olyan játékmód, amelyben a játékosok egymás ellen küzdenek, és csak egy maradhat. |
| **ResultScreen** | A játék végén megjelenő képernyő, amely ranglistát és győztest mutat. |
| **Reszponzív felület** | A weboldal automatikusan igazodik az eszköz (mobil, tablet, PC) képernyőméretéhez. |

---

## 9. Use Case Diagram
<img width="371" height="429" alt="image" src="https://github.com/user-attachments/assets/987a257d-4b59-4ba2-b69b-931ee1623f61" />

<img width="1023" height="338" alt="image" src="https://github.com/user-attachments/assets/2082820a-b3a9-4901-92df-c6d8adb188a5" />

<img width="927" height="393" alt="image" src="https://github.com/user-attachments/assets/ad4e7e97-bc42-4b98-8572-c0833a99f7b9" />



