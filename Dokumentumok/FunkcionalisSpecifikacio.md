# Funkcionális specifikáció

## 1. Üzleti Megszorítások (Business Constraints)

Ez a dokumentum rögzíti az alkalmazás felhasználói felületének és üzleti logikájának alapvető megszorításait és feltételes lépéseit.

### 1. Játékmód Választás

**Belső Logikai Megszorítás:** A rendszernek pontosan egy játékmódot kell inicializálnia.

| Feltétel | Eredmény / Következő Lépés |
| :--- | :--- |
| **Választás: Multiplayer** | A felhasználó a **Multiplayer Felületre** lép tovább (F2/F4 funkció). |
| **Választás: Player vs AI** | A felhasználó a **Solo Beállítási Felületre** lép tovább (F6 funkció). |


### 2. Multiplayer Felület

**Belső Logikai Megszorítás:** A felhasználónak a szoba tranzakcióját (létrehozás vagy csatlakozás) kell választania.

| Feltétel | Eredmény / Következő Lépés |
| :--- | :--- |
| **Akció: Szoba Létrehozása (Host)** | A felhasználó az **Szoba Létrehozása** dialógusra lép (F3 funkció). |
| **Akció: Csatlakozás a Szobához (Join)** | A felhasználó a **Csatlakozás a Szobához** dialógusra lép (F4 funkció). |


### 3. Szoba Létrehozása (Host)

**Megszorítás:** A szoba létrehozásához érvényes kód és név megadása kötelező.

| Feltétel | Eredmény / Következő Lépés |
| :--- | :--- |
| **Input: Érvényes Szobakód ÉS Név megadva** | A szoba létrejön. A felhasználó **Host státusszal** belép a Lobbyba (F5 funkció). |
| **Akció: Vissza (Back) gomb** | Visszalépés a **Multiplayer Felületre** (F2 funkció). |


### 4. Csatlakozás a Szobához (Player)

**Megszorítás:** A szobához való csatlakozáshoz érvényes kód és név megadása kötelező.

| Feltétel | Eredmény / Következő Lépés |
| :--- | :--- |
| **Input: Érvényes Szobakód ÉS Név megadva** | A felhasználó **Player státusszal** belép a Lobbyba (F5 funkció). |
| **Akció: Vissza (Back) gomb** | Visszalépés a **Multiplayer Felületre** (F2 funkció). |


### 5. Lobby Állapot (Várakozás)

**Megszorítás:** A játékot csak a Host jogosult elindítani.

| Feltétel | Eredmény / Következő Lépés |
| :--- | :--- |
| **Akció: Host elindítja a játékot** | A rendszer szinkronizálja a klienseket, és elindul a **Játékmenet (Core Loop)**. |
| **Állapot: Hostra való Várakozás** | A játékosok a Lobbyban maradnak, amíg a Host meg nem nyomja a Start gombot. |


### 6. Player vs AI (Solo) Beállítások Kiválasztása

**Megszorítás:** A játékindítás előtt a beállításokat el kell végezni.

| Feltétel | Eredmény / Következő Lépés |
| :--- | :--- |
| **Akció: Solo mód Beállítások** | A felhasználó **megadhatja** a kérdések számát és az AI nehézségét (F7 funkció). |
| **Akció: Vissza (Back) gomb** | Visszalépés a **Játékmód Választó** felületre (F1 funkció). |


### 7. Solo Mód Beállítva

**Megszorítás:** A játék csak akkor indulhat el, ha minden beállítási paraméter érvényes/megadott.

| Feltétel | Eredmény / Következő Lépés |
| :--- | :--- |
| **Állapot: Beállítások Készen Állnak (Pl. Start gomb aktív)** | A játék elindul a Solo mód beállításokkal. |
| **Állapot: Beállítások Hiányosak** | A rendszer **nem enged tovább lépni**, a Start gomb inaktív marad. |

---

## 2. Használati esetek

| Szereplő | Jogosultságok / Leírás |
|-----------|------------------------|
| **Host (Szoba létrehozó)** | Szobát hoz létre, várakozik a játékosokra, majd elindítja a játékot. |
| **Játékos** | Megadja a nevét és szobakódját, belép a játékba, válaszol a kérdésekre. |
| **Rendszer (Szerver)** | Lekéri a kérdéseket az Open Trivia API-ról, kezeli az eseményeket, értékeli a válaszokat és meghatározza a győztest. |

---

## 3. Megfeleltetés (követelmények – funkciók)

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

## 4. Képernyőtervek

- **Main Menu:** „Szoba létrehozása” és „Csatlakozás szobához” gombok  
- **JoinRoom:** név + szobakód beviteli mezők  
- **Lobby:** játékoslista, host jelölés, „Játék indítása” gomb  
- **GameScreen:** kérdés, négy válaszlehetőség, visszaszámláló, élő státusz  
- **ResultScreen:** animált befejező képernyő, győztes, ranglista, „Kilépés a főmenübe”  

<img width="736" height="707" alt="wireframe" src="https://github.com/user-attachments/assets/21d32b4a-1601-4eba-ab20-43e0e73ed439" />


---

## 5. Forgatókönyv – Példa játék menete

- [UserStory1](UserStory1)
- [UserStory2](UserStory2)
- [UserStory3](UserStory3)
- [UserStory4](UserStory4)
- [UserStory5](UserStory5)
- [UserStory6](UserStory6)

---

## 6. Funkció – Követelmény megfeleltetés

| Funkció | Modul ID | Lefedettség |
|----------|-----------|--------------|
| Szobakezelés | K1, K2, K3 | Kész |
| Kérdéslekérés és válaszadás | K4, K5, K6 | Kész |
| Battle Royale logika | K7, K8, K11 | Kész |
| Ranglista és eredmény | K9, K10 | Kész |
| Fejlesztési modulok | K12 | Fejlesztés alatt |

---

## 7. Fogalomszótár

| Fogalom | Meghatározás |
|----------|---------------|
| **Battle Royale** | Olyan játékmód, ahol több játékos küzd, és a cél az utolsóként bent maradni. |
| **Socket.IO** | Valós idejű kommunikációt biztosító kliens-szerver technológia. |
| **Host** | A szobát létrehozó játékos, aki a játékot elindítja. |
| **Lobby** | A játék előtti váróképernyő, ahol a játékosok csatlakoznak. |
| **ResultScreen** | A játék végén megjelenő képernyő, amelyen a ranglista és a győztes látható. |
| **Open Trivia API** | Nyílt kérdésbank, amely kategóriák szerint rendszerezett, több-válaszos kvízkérdéseket szolgáltat. |
| **Round (Kör)** | Egy kérdés-válasz ciklus a játékban. |

