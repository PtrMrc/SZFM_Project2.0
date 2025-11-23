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

| Követelmény | Funkció | Lefedés |
|--------------|----------|---------|
| K1–K3 | Lobby és szobakezelés | Kész |
| K4–K8 | Játéklogika (indítás, válasz, kiesés, továbbjutás) | Kész |
| K9–K11 | Ranglista és eredménymegjelenítés | Kész |
| K12 | Fejlesztés alatt álló funkciók | Fejlesztés alatt |

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

1. A host létrehoz egy szobát („ROOM123”).  
2. A játékosok belépnek a szobakóddal.  
3. A Lobby-ban megjelenik a játékosok listája.  
4. A host elindítja a játékot.  
5. A rendszer lekéri az első kérdést az **Open Trivia API-ról**.  
6. Minden játékos egyszerre kapja meg a kérdést, és 10 másodperc alatt válaszol.  
7. A hibás válaszadók kiesnek, a helyes válaszadók továbbjutnak.  
8. A körök ismétlődnek, amíg csak egy játékos marad.  
9. A győztes és a ranglista megjelenik a ResultScreenen.  
10. A játékosok kiléphetnek a főmenübe.

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

