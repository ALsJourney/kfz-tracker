# KFZ-Tracker — Design-Spezifikation

> Letzte Aktualisierung: 2026-04-12  
> Basiert auf Codeanalyse der `main`-Branch (Next.js 15, Tailwind CSS, SQLite via better-sqlite3)

---

## 1. Projektkontext

KFZ-Tracker ist eine deutschsprachige Open-Source-Webanwendung für Privatpersonen und Kleinbetriebe zum Verwalten von:

- **Fahrzeugen** (`fahrzeuge`) — Stammdaten, Kaufpreis, Kilometerstand, TÜV/Pickerl
- **Problemen** (`probleme`) — Erfassung, Statusverfolgung, Kosten, Fotoanhang
- **Teilen** (`teile`) — Ersatzteilbestand mit Kaufdaten und Belegen
- **Kostenübersicht** — aggregierte Investitionen pro Fahrzeug

**Tech-Stack:** Next.js 15 · TypeScript · Tailwind CSS · better-sqlite3 · Geist Font

---

## 2. Design-Prinzipien

| Prinzip | Beschreibung |
|---|---|
| **Deutschsprachig** | Alle Labels, Fehlermeldungen und Platzhalter auf Deutsch |
| **Zugänglich** | WCAG 2.1 AA — Kontraste ≥ 4.5:1, Fokus-Ringe sichtbar, Touch-Targets ≥ 44px |
| **Responsiv** | Mobile-first; funktioniert ab 320px Breite |
| **Minimalistisch** | Keine unnötigen Animationen; klare Hierarchie |
| **Automotive Feel** | Blau als Primärfarbe, Orange für Warnungen, Grün für OK |

---

## 3. Farbpalette

Vollständige Token-Definitionen: [`tokens.css`](tokens.css)

| Token | Wert | Verwendung im Code |
|---|---|---|
| `--color-primary` | `#1A56DB` | `bg-blue-600`, `text-blue-700` |
| `--color-primary-dark` | `#1E429F` | `hover:bg-blue-700`, `text-blue-800` |
| `--color-primary-light` | `#EBF5FF` | `bg-blue-50` |
| `--color-accent` | `#FF8C00` | Noch nicht im Code — für Warnbanner vorgesehen |
| `--color-success` | `#057A55` | `text-green-700`, `bg-green-100` |
| `--color-danger` | `#C81E1E` | `text-red-700`, `bg-red-100` |
| `--color-warning-dark` | `#9F580A` | `text-yellow-700`, `bg-yellow-100` |
| `--color-bg` | `#F9FAFB` | `bg-gray-50` (body) |
| `--color-surface` | `#FFFFFF` | `bg-white` (Karten) |
| `--color-border` | `#E5E7EB` | `border-gray-200` |
| `--color-text` | `#111827` | `text-gray-900` |
| `--color-text-muted` | `#6B7280` | `text-gray-500` |

---

## 4. Typografie

- **Schriftart:** Geist (bereits eingebunden via `next/font/google`) → Fallback: Inter, system-ui
- **Basis-Schriftgröße:** 16px
- **Zeilenhöhe:** 1.5 (Fließtext), 1.25 (Überschriften)

| Verwendung | Klasse | Größe |
|---|---|---|
| Seitenüberschrift (H1) | `text-2xl font-bold` | 24px / 700 |
| Abschnittsüberschrift (H2) | `text-lg font-bold` | 18px / 700 |
| Karten-Titel | `font-bold text-base` | 16px / 700 |
| Fließtext | `text-sm` / `text-base` | 14–16px / 400 |
| Labels & Metadaten | `text-xs` | 12px / 400–500 |

---

## 5. Aktuelles Layout & Navigation

Das bestehende Layout (`app/layout.tsx`) besteht aus:

```
┌──────────────────────────────────────────────────────────┐
│ HEADER                                                    │
│  🚗 KFZ-Tracker            [+ Fahrzeug hinzufügen]       │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  MAIN (max-w-5xl, px-4, py-8)                           │
│  {children}                                               │
│                                                           │
├──────────────────────────────────────────────────────────┤
│ FOOTER                                                    │
│  KFZ-Tracker — Open Source für den deutschsprachigen Raum│
└──────────────────────────────────────────────────────────┘
```

**Empfehlung:** Sidebar-Navigation für Desktop ergänzen (sihe Wireframes).

---

## 6. Seitenübersicht & Routen

| Route | Komponente | Beschreibung |
|---|---|---|
| `/` | `app/page.tsx` | Fahrzeug-Übersicht (Dashboard) |
| `/fahrzeuge/neu` | `app/fahrzeuge/neu/page.tsx` | Neues Fahrzeug anlegen |
| `/fahrzeuge/[id]` | `app/fahrzeuge/[id]/page.tsx` | Fahrzeugdetails mit Problemen & Teilen |
| `/fahrzeuge/[id]/bearbeiten` | `app/fahrzeuge/[id]/bearbeiten/page.tsx` | Fahrzeug bearbeiten |

---

## 7. Seiten-Designs

### 7.1 Dashboard — Fahrzeugliste (`/`)

**Zweck:** Schnellübersicht aller Fahrzeuge, Gesamtinvestition auf einen Blick.

**Elemente:**
- Kopfzeile: "Meine Fahrzeuge" + Gesamtinvestition (wenn > 0)
- **Leer-Zustand:** Großes Icon 🚗, Ermutigungstext, CTA "Fahrzeug hinzufügen"
- **Fahrzeug-Grid:** 2 Spalten ab `md`, 1 Spalte auf Mobile

**Fahrzeug-Karte (bestehend):**
```
┌─────────────────────────────────────────────────────┐
│  BMW 3er                              TÜV: 12.Mai   │
│  2018 · B-AB 1234                    (orange Badge) │
│─────────────────────────────────────────────────────│
│  Kaufpreis    Reparaturen/Teile    Gesamt           │
│  12.000 €     3.400 €              15.400 €         │
│─────────────────────────────────────────────────────│
│  3 Probleme · 5 Teile                               │
└─────────────────────────────────────────────────────┘
```

**TÜV-Badge:**
- `< 0 Tage` → `bg-red-100 text-red-700` "Abgelaufen"
- `< 60 Tage` → `bg-yellow-100 text-yellow-700` "X Tage"
- `≥ 60 Tage` → `bg-green-100 text-green-700` Datum

---

### 7.2 Fahrzeugdetails (`/fahrzeuge/[id]`)

**Kopfzeile:**
```
← Alle Fahrzeuge

BMW 3er (2018)              [Bearbeiten]
📋 B-AB 1234  🎨 Schwarz  🛣️ 145.000 km
```

**Kosten-Grid (4 Kacheln):**
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│ Kaufpreis│ │Reparatur.│ │Ersatzteile│ │ Gesamt invest│
│ 12.000 € │ │  2.000 € │ │  1.400 € │ │  15.400 €    │
└──────────┘ └──────────┘ └──────────┘ └──────────────┘
                                           (blau hervorgehoben)
```

**TÜV-Banner:** Nur sichtbar wenn `tuev_datum` gesetzt.

**Notizen-Banner:** Gelbes Box (wenn `notizen` vorhanden).

**Abschnitte:** Probleme | Teile (beide inline, kein Tab-Wechsel nötig bei geringer Datenmenge)

---

### 7.3 Probleme-Sektion (`ProblemSection.tsx`)

**Listen-Ansicht (Problemkarte):**
```
┌────────────────────────────────────────────────────────┐
│ [Offen]  12.04.2026  150,00 €           [→ In Bearb.] [✕]│
│ Bremsscheiben verschlissen                              │
│ Vorne links und rechts müssen getauscht werden.         │
│ [Foto-Vorschau 80px hoch]                               │
└────────────────────────────────────────────────────────┘
```

**Status-Badges:**
| Status | Tailwind-Klassen |
|---|---|
| `offen` | `bg-red-100 text-red-700` |
| `in_bearbeitung` | `bg-yellow-100 text-yellow-700` |
| `geloest` | `bg-green-100 text-green-700` |

**Problem-Formular (Inline):**
- Titel * + Datum (Grid 2-spaltig)
- Beschreibung (Textarea)
- Status + Kosten (Grid 2-spaltig)
- Foto-Upload (UploadButton)
- Buttons: Speichern | Abbrechen

---

### 7.4 Teile-Sektion (`TeileSection.tsx`)

**Teilekarte:**
```
┌────────────────────────────────────────────────────────┐
│ Ölfilter                                   2× · [✕]   │
│ MANN-Filter · W712/75 · Bosch              12.04.2026  │
│ 8,50 € / Stück = 17,00 € gesamt                       │
│ Gekauft bei: Auto-Ersatzteile-Müller                   │
└────────────────────────────────────────────────────────┘
```

**Teil-Formular (Inline):**
- Name * + Kaufdatum (Grid 2-spaltig)
- Teilenummer + Hersteller (Grid 2-spaltig)
- Preis + Menge (Grid 2-spaltig)
- Lieferant
- Notizen (Textarea)
- Rechnung-Upload
- Buttons: Speichern | Abbrechen

---

### 7.5 Fahrzeug anlegen/bearbeiten (`/fahrzeuge/neu`, `/fahrzeuge/[id]/bearbeiten`)

**Formular-Felder:**

| Feld | Typ | Pflichtfeld |
|---|---|---|
| Marke | Text | ✅ |
| Modell | Text | ✅ |
| Baujahr | Number | ❌ |
| Kennzeichen | Text | ❌ |
| Farbe | Text | ❌ |
| Kaufpreis | Number (€) | ❌ |
| Kilometerstand | Number | ❌ |
| TÜV / Pickerl Datum | Date | ❌ |
| Notizen | Textarea | ❌ |

---

## 8. Komponenten

Vollständige Beschreibungen: [`components/README.md`](components/README.md)

| Komponente | Pfad | Beschreibung |
|---|---|---|
| `UploadButton` | `components/UploadButton.tsx` | Datei-Upload mit Fortschrittsanzeige |
| `ProblemSection` | `app/fahrzeuge/[id]/ProblemSection.tsx` | Probleme-Liste + Inline-Formular |
| `TeileSection` | `app/fahrzeuge/[id]/TeileSection.tsx` | Teile-Liste + Inline-Formular |

**Empfohlene neue Komponenten:**

| Komponente | Beschreibung |
|---|---|
| `StatusBadge` | Wiederverwendbare Badges (offen/in_bearbeitung/geloest/tuev) |
| `CostTile` | Einzelne Kosten-Kachel aus der Fahrzeugdetail-Seite |
| `EmptyState` | Leer-Zustand mit Icon und CTA |
| `TuevAlert` | Farblich kodiertes TÜV-Ablauf-Banner |
| `ConfirmDialog` | Bestätigungsdialog vor Löschaktionen (ersetzt `window.confirm`) |

---

## 9. Formular-UX-Regeln

1. **Labels immer sichtbar** — kein Placeholder als Ersatz für Labels
2. **Pflichtfelder** mit `*` markieren
3. **Fehlermeldungen** direkt unter dem Feld in `text-red-600 text-xs`
4. **Fokus-Ring** sichtbar: `focus:outline-none focus:ring-2 focus:ring-blue-500`
5. **Datum-Felder** mit `type="date"` und `defaultValue` auf Heute
6. **Zahlen-Felder** mit `type="number"`, `min="0"`, `step="0.01"` für Euro-Beträge
7. **Buttons:** Primäraktion links (Speichern), Sekundäraktion rechts (Abbrechen)
8. **Disabled-State** während Submit: `disabled:opacity-50`, Spinner-Text

---

## 10. Responsive Breakpoints

| Breakpoint | Breite | Layoutanpassungen |
|---|---|---|
| Mobile | < 640px | 1-spaltiges Grid, kein Sidebar |
| Tablet | 640–1023px | 2-spaltiges Grid |
| Desktop | ≥ 1024px | 2-spaltiges Fahrzeug-Grid, optionale Sidebar |

**Mobile-Prioritäten:**
- Alle Tap-Targets ≥ 44×44px
- Formulare einspaltig
- Navigation im Header (derzeit ausreichend bei kleinem Feature-Set)

---

## 11. Barrierefreiheit (WCAG 2.1 AA)

- [ ] Alle Bilder mit `alt`-Attribut
- [ ] Farbkontrast ≥ 4.5:1 für Normaltext, ≥ 3:1 für großen Text
- [ ] Fokus-Reihenfolge logisch (Tab-Reihenfolge im DOM)
- [ ] Formular-Felder mit `<label>` und `htmlFor`
- [ ] Buttons mit aussagekräftigem Text (kein reines Icon ohne `aria-label`)
- [ ] `lang="de"` bereits gesetzt im `<html>` — ✅

---

## 12. Bekannte Design-Verbesserungspotenziale

1. **`window.confirm`** in `ProblemSection` und `TeileSection` durch `ConfirmDialog`-Komponente ersetzen
2. **Foto-Vorschau** beim Bearbeiten eines Problems fehlt noch
3. **Kilometerstand** wird auf der Dashboard-Karte nicht angezeigt
4. **Legende** für TÜV-Farbkodierung fehlt (erstes Mal verwirrend für neue Nutzer)
5. **Erfolgs-Feedback** nach Speichern (Toast-Notification) noch nicht implementiert
6. **Belege/Rechnungen** für Teile haben keinen Vorschau-Link
