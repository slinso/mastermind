# Mastermind - Implementierungsplan

## Übersicht

Stufenweise Implementierung des Spiels Mastermind mit SvelteKit, Svelte 5 und TailwindCSS.

**Spielmodus:** Singleplayer (Spieler rät Computer-Code)
**Konfiguration:** Positionen (3-6), Farben (3-8), Versuche (5-15), Wiederholung optional

---

## Dateistruktur

```
src/
├── lib/
│   ├── types/
│   │   └── game.ts                 # TypeScript Interfaces
│   ├── stores/
│   │   └── game.svelte.ts          # Reaktiver Game State (Svelte 5 Runes)
│   ├── utils/
│   │   ├── code-generator.ts       # Geheimcode-Generierung
│   │   ├── feedback-calculator.ts  # Feedback-Berechnung
│   │   └── storage.ts              # localStorage Wrapper
│   └── components/
│       ├── game/
│       │   ├── GameBoard.svelte    # Hauptspielfeld
│       │   ├── GuessRow.svelte     # Eine Versuchsreihe
│       │   ├── ColorPeg.svelte     # Einzelner Farbstift
│       │   ├── FeedbackPegs.svelte # Feedback-Anzeige
│       │   ├── ColorPicker.svelte  # Farbauswahl-Palette
│       │   └── SecretCode.svelte   # Geheimcode (verdeckt/aufgedeckt)
│       ├── ui/
│       │   ├── Button.svelte
│       │   ├── Modal.svelte
│       │   └── NumberInput.svelte
│       └── settings/
│           └── GameSettings.svelte
├── routes/
│   ├── +page.svelte                # Hauptseite
│   └── stats/+page.svelte          # Statistik-Seite
```

---

## Phase 1: Basis-Spiellogik und minimale UI ✅ ABGESCHLOSSEN

**Ziel:** Funktionierendes Spiel mit Standardkonfiguration

### Schritte

1. **Types erstellen** (`src/lib/types/game.ts`)
   - `ColorId`, `Color`, `Guess`, `Feedback`, `GameConfig`, `GameState`, `GameStatus`
   - Farbdefinitionen mit Tailwind-Klassen (8 Farben)
   - `DEFAULT_CONFIG`: 4 Positionen, 6 Farben, 10 Versuche

2. **Utility-Funktionen** (`src/lib/utils/`)
   - `code-generator.ts`: Geheimcode generieren (mit/ohne Wiederholung)
   - `feedback-calculator.ts`: Schwarze/weiße Stifte berechnen

3. **Game Store** (`src/lib/stores/game.svelte.ts`)
   - Svelte 5 Runes: `$state`, `$derived`
   - Methoden: `startNewGame()`, `setColor()`, `submitGuess()`

4. **Basis-Komponenten**
   - `ColorPeg.svelte` - Farbiger Kreis (klickbar)
   - `FeedbackPegs.svelte` - Kleine schwarze/weiße Punkte
   - `ColorPicker.svelte` - Farbpalette zur Auswahl
   - `GuessRow.svelte` - Eine Zeile mit Pegs + Feedback
   - `SecretCode.svelte` - Versteckter/aufgedeckter Code
   - `GameBoard.svelte` - Zusammenführung aller Komponenten

5. **Hauptseite** (`src/routes/+page.svelte`)
   - GameBoard einbinden
   - "Neues Spiel" Button

### Testbare Meilensteine
- [x] Geheimcode wird korrekt generiert
- [x] Farbauswahl funktioniert
- [x] Feedback-Berechnung ist korrekt
- [x] Gewonnen/Verloren wird erkannt

---

## Phase 2: Erweiterte UI und Konfigurierbarkeit ✅ ABGESCHLOSSEN

**Ziel:** Vollständige Konfigurierbarkeit und bessere UX

### Schritte

1. **UI-Komponenten**
   - `Button.svelte` - Varianten (primary, secondary, danger)
   - `Modal.svelte` - Für Einstellungen und Game Over
   - `NumberInput.svelte` - Mit Min/Max Validierung

2. **Einstellungen** (`GameSettings.svelte`)
   - Positionen: 3-6
   - Farben: 3-8
   - Versuche: 5-15
   - Wiederholung: Toggle
   - Layout: Vertikal/Horizontal

3. **UI/UX Verbesserungen**
   - Svelte Transitions/Animationen
   - Responsive Design (Mobile + Desktop)
   - Game Over Modal mit Ergebnis
   - Aktuellen Versuch zurücksetzen
   - Horizontales Layout für Widescreen-Monitore

### Testbare Meilensteine
- [x] Einstellungen werden korrekt angewendet
- [x] Spiel funktioniert mit allen Konfigurationen
- [x] UI ist responsive
- [x] Layout-Wechsel funktioniert

---

## Phase 3: Persistenz und Statistiken ✅ ABGESCHLOSSEN

**Ziel:** Spielfortschritt und Statistiken speichern

### Schritte

1. **localStorage Wrapper** (`src/lib/utils/storage.ts`)
   - Config speichern/laden
   - Statistiken speichern/laden

2. **Statistik-Funktionen**
   - Spiele gespielt/gewonnen/verloren
   - Durchschnittliche Versuche
   - Beste Runde
   - Spielzeit
   - **Schwierigkeitsgrad-System** (Leicht, Mittel, Schwer)

3. **Statistik-Seite** (`src/routes/stats/+page.svelte`)
   - Übersicht aller Statistiken
   - Filterung nach Schwierigkeitsgrad
   - Letzte Spiele mit Schwierigkeits-Badge
   - Reset-Option

### Testbare Meilensteine
- [x] Einstellungen bleiben nach Reload
- [x] Statistiken werden korrekt gezählt
- [x] Statistik-Seite zeigt korrekte Daten
- [x] Schwierigkeitsgrad-Filterung funktioniert

---

## Phase 4: SQLite-Integration (ausstehend)

**Ziel:** Persistente Datenbank für erweiterte Features

- [ ] SQLite via better-sqlite3 oder libsql
- [ ] API-Endpoints: `POST/GET /api/games`, `GET /api/stats`
- [ ] Migration von localStorage
- [ ] Leaderboard (optional)

---

## Kritische Dateien

| Datei | Beschreibung |
|-------|--------------|
| `src/lib/types/game.ts` | Zentrale TypeScript-Definitionen + Schwierigkeitsgrad |
| `src/lib/stores/game.svelte.ts` | Reaktiver Game State |
| `src/lib/utils/feedback-calculator.ts` | Kernalgorithmus |
| `src/lib/utils/storage.ts` | localStorage Wrapper |
| `src/lib/components/game/GameBoard.svelte` | Hauptkomponente |
| `src/routes/+page.svelte` | Einstiegspunkt |
| `src/routes/stats/+page.svelte` | Statistik-Seite |

---

## Git-Commits

```
5cd8591 - feat: Add difficulty-based statistics filtering
9e1b4e7 - feat: Implement Phase 3 - localStorage and statistics
4acd581 - feat: Add horizontal layout option for widescreen monitors
8eb1641 - feat: Implement Phase 2 - Settings and improved UI
c86372b - fix: Change orange to black and purple to white
eabb853 - feat: Implement Mastermind game Phase 1
```
