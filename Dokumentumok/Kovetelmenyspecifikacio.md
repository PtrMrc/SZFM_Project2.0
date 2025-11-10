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

## 4. Funkcionális követelmények

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

## 8. Követelménylista

| Modul ID | Modul neve | Verzió | Leírás |
|-----------|-------------|--------|--------|
| K1 | Szoba létrehozása | 1.0 | Egyedi szobakód generálása, host beállítása. |
| K2 | Csatlakozás szobához | 1.0 | Felhasználónév és kód alapján csatlakozás a szerverhez. |
| K3 | Lobby kezelése | 1.0 | A játékosok és a host valós idejű megjelenítése. |
| K4 | Játék indítása | 1.0 | A host indíthatja a játékot, más nem. |
| K5 | Kérdéslekérés az Open Trivia API-ból | 1.0 | Kategorizált kérdések automatikus betöltése. |
| K6 | Időzítő | 1.0 | A válaszadási idő 10 másodperc, vizuális visszaszámlálással. |
| K7 | Válaszkezelés | 1.0 | A válaszokat a szerver gyűjti, majd értékeli. |
| K8 | Kiesés kezelése | 1.0 | A rossz válaszadók automatikus kizárása a játékból. |
| K9 | Új kör indítása | 1.0 | A helyesen válaszolók új kérdést kapnak. |
| K10 | Játék vége és ranglista | 1.0 | A rendszer meghatározza a győztest és a helyezéseket. |
| K11 | Eredmény animáció | 1.0 | Fade-in animációval megjelenő végeredmény és ranglista. |
| K12 | Kilépés főmenübe | 1.0 | A játékos visszatérhet a kezdőképernyőre. |
| K13 | Tematikus játékmód | 2.0 | A játékos választhatja ki a témát (fejlesztés alatt). |
| K14 | Profilrendszer | 2.0 | Profil, statisztika és győzelmi adatok (fejlesztés alatt). |

---

## 9. Riportok

- Szabad riport:  
  Az alkalmazás célja egy valós idejű, többjátékos kvízrendszer létrehozása, amely egyszerre több felhasználót képes kiszolgálni, és minden játékosnak azonos kérdéseket biztosít.  
  A rendszer automatikusan értékeli a válaszokat, rangsort készít, és vizuális visszajelzést ad a játékosoknak.

- Irányított riport (példák):  
  - Mennyi ideje van a játékosnak válaszolni? → 10 másodperc  
  - Ki indíthatja a játékot? → Csak a host  
  - Milyen kérdések vannak? → Az Open Trivia API által biztosított kategóriákból  
  - Mikor ér véget a játék? → Ha csak egy játékos marad életben  

---

## 10. Fogalomtár

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
