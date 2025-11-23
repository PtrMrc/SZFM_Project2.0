# Funkcionális specifikáció

## 1. Áttekintés

A Quiz Royale egy online, valós idejű, multiplayer kvízjáték, amelyben a játékosok egymás ellen mérhetik össze általános műveltségüket.  
A cél, hogy a játékosok egy Battle Royale-szerű küzdelemben vegyenek részt, ahol minden kérdés után azok a játékosok esnek ki, akik hibásan válaszoltak.  
A végén az utolsó bent maradt játékos a győztes.  

A játék böngészőből elérhető, reszponzív felülettel rendelkezik, és valós idejű kommunikációt használ a Flask (Python) és React.js technológiák között Socket.IO segítségével.  
A kérdéseket az Open Trivia API szolgáltatja, amely tematikusan gyűjtött kérdéseket kínál több kategóriában (pl. Tudomány, Filmek, Történelem, Sport stb.).  

---

## 2. Jelenlegi helyzet

A legtöbb online kvízjáték oktatási célokat szolgál, és nem biztosít közvetlen versenyzést a játékosok között.  
A játékosok általában egymástól függetlenül töltik ki a teszteket, és csak utólag látják az eredményeket.  

A fiatalabb generáció számára ez kevésbé motiváló, mert hiányzik a valós idejű interakció és a kompetitív játékélmény.  
A Quiz Royale ezen változtat azzal, hogy a kvíz-mechanikát ötvözi a Battle Royale játékmóddal,  
így a játék pörgős, versengő és szórakoztató élményt nyújt.

---

## 3. Jelenlegi üzleti folyamatok modellje

A legtöbb online kvízjátékban a játékosok nem egyszerre játszanak,  
vagy nem érzékelik egymás előrehaladását.  
A hagyományos rendszerek (pl. Kahoot) oktatási célokra születtek, és kevésbé hangsúlyozzák a versenyt.

A Quiz Royale ezzel szemben valós időben működik, minden játékos egyszerre kapja a kérdéseket,  
így a verseny gyors, dinamikus és élő.

---

## 4. Igényelt üzleti folyamatok modellje

A cél egy interaktív, valós idejű játékplatform megvalósítása, ahol:
- a játékosok egy szobába csatlakoznak,
- a host indítja a játékot,
- mindenki egyszerre kap kérdést,
- a hibásan válaszolók kiesnek,
- a helyesen válaszolók továbbjutnak,
- végül az utolsó bent maradt játékos lesz a győztes.  

A rendszer automatikusan értékeli a válaszokat és megjeleníti az eredményeket,  
így nincs szükség manuális pontozásra vagy beavatkozásra.

---

## 5. Használati esetek

| Szereplő | Jogosultságok / Leírás |
|-----------|------------------------|
| **Host (Szoba létrehozó)** | Szobát hoz létre, várakozik a játékosokra, majd elindítja a játékot. |
| **Játékos** | Megadja a nevét és szobakódját, belép a játékba, válaszol a kérdésekre. |
| **Rendszer (Szerver)** | Lekéri a kérdéseket az Open Trivia API-ról, kezeli az eseményeket, értékeli a válaszokat és meghatározza a győztest. |

---

## 6. Megfeleltetés (követelmények – funkciók)

| Funkció Azonosító | Kapcsolódó Követelmény | Funkció Neve | Leírás |
| :--- | :--- | :--- | :--- |
| **F1** | K1, K2 | **Játékmód Választó UI** | A nyitóképernyőn a felhasználó választhat a "Multiplayer" és a "Player vs AI" módok között. |
| **F2** | K1, K2 | **Automatikus Host Logika** | A rendszer figyeli a szobába lépés sorrendjét; az első csatlakozó automatikusan megkapja a Host jogosultságot (start gomb), a többiek Player státuszt kapnak. |
| **F3** | K4 | **AI Konfigurációs Panel** | "Player vs AI" módban a játék indítása előtt beállítható csúszkákkal a kérdések száma (5-ös lépésköz) és az AI pontossága (Könnyű/Közepes/Nehéz). |
| **F4** | K3 | **Socket Szoba Kezelő** | A szerveroldali logika, amely a klienseket azonos `roomID` alapján csoportosítja és szinkronban tartja a kapcsolatot. |
| **F5** | K9 | **Szerencsekerék Modul** | A körök elején megjelenő vizuális komponens, amely véletlenszerűen kiválaszt egy kategóriát (pl. History, Science), és átadja az ID-t az API hívónak. |
| **F6** | K5 | **OpenTrivia API Híd** | A backend funkció, amely a szerencsekerék által kapott kategória ID-val lekér egy kérdést, és JSON formátumban továbbítja a klienseknek. |
| **F7** | K6 | **Szinkron Időzítő** | A szerver által vezérelt 20 másodperces visszaszámláló, amely biztosítja, hogy minden kliensnél (és az AI-nál is) egyszerre járjon le az idő. |
| **F8** | K6 | **Felezés (50/50) Logika** | A játékos kliensoldali funkciója: gombnyomásra elrejti a 3 rossz válaszból 2-t. A rendszer rögzíti a felhasználást (meccsenként 1x). |
| **F9** | K4 | **AI Bot Szimulátor** | Az algoritmus, amely az "AI vs Player" módban a beállított pontosság alapján dönt a helyes/helytelen válaszról, és véletlenszerű késleltetéssel "válaszol". |
| **F10** | K7, K8 | **Válasz Validátor** | A beérkező válaszok összevetése a helyes megoldással. |
| **F11** | K8 | **Kegyelmi Szabály (Mercy Rule)** | Speciális feltételkezelés: ha `TotalPlayers == WrongAnswers`, akkor a rendszer senkit nem állít Spectator státuszba, hanem új kört indít. |
| **F12** | K8 | **Kiesés Kezelő** | Ha a kegyelmi szabály nem aktív, a rossz választ adó játékos státuszát aktívról Spectator-ra (kiesett) állítja. |
| **F13** | K10 | **Győzelem Detektor** | Minden kör végén ellenőrzi az aktív játékosok számát. Ha `ActiveCount == 1`, leállítja a játékciklust és meghívja az eredményképernyőt. |
| **F14** | K11 | **Rangsor Kalkulátor** | Összeállítja a listát a játékosokból a kiesés ideje (kör száma) alapján. |

---

## 7. Képernyőtervek

- **Main Menu:** „Szoba létrehozása” és „Csatlakozás szobához” gombok  
- **JoinRoom:** név + szobakód beviteli mezők  
- **Lobby:** játékoslista, host jelölés, „Játék indítása” gomb  
- **GameScreen:** kérdés, négy válaszlehetőség, visszaszámláló, élő státusz  
- **ResultScreen:** animált befejező képernyő, győztes, ranglista, „Kilépés a főmenübe”  

<img width="736" height="707" alt="wireframe" src="https://github.com/user-attachments/assets/21d32b4a-1601-4eba-ab20-43e0e73ed439" />


---

## 8. Forgatókönyv – Példa játék menete

- [UserStory1](UserStory1)
- [UserStory2](UserStory2)
- [UserStory3](UserStory3)
- [UserStory4](UserStory4)
- [UserStory5](UserStory5)
- [UserStory6](UserStory6)

---

## 9. Funkció – Követelmény megfeleltetés

| Funkció | Modul ID | Lefedettség |
|----------|-----------|--------------|
| Szobakezelés | K1, K2, K3 | Kész |
| Kérdéslekérés és válaszadás | K4, K5, K6 | Kész |
| Battle Royale logika | K7, K8, K11 | Kész |
| Ranglista és eredmény | K9, K10 | Kész |
| Fejlesztési modulok | K12 | Fejlesztés alatt |

---

## 10. Fogalomszótár

| Fogalom | Meghatározás |
|----------|---------------|
| **Battle Royale** | Olyan játékmód, ahol több játékos küzd, és a cél az utolsóként bent maradni. |
| **Socket.IO** | Valós idejű kommunikációt biztosító kliens-szerver technológia. |
| **Host** | A szobát létrehozó játékos, aki a játékot elindítja. |
| **Lobby** | A játék előtti váróképernyő, ahol a játékosok csatlakoznak. |
| **ResultScreen** | A játék végén megjelenő képernyő, amelyen a ranglista és a győztes látható. |
| **Open Trivia API** | Nyílt kérdésbank, amely kategóriák szerint rendszerezett, több-válaszos kvízkérdéseket szolgáltat. |
| **Round (Kör)** | Egy kérdés-válasz ciklus a játékban. |

