# Wireframe: Fahrzeugdetails (`/fahrzeuge/[id]`)

## Desktop-Ansicht

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER: 🚗 KFZ-Tracker               [+ Fahrzeug hinzufügen]    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ← Alle Fahrzeuge                                                 │
│                                                                   │
│  BMW 3er (2018)                             [Bearbeiten]         │
│  📋 B-AB 1234  🎨 Schwarz  🛣️ 145.000 km                        │
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────────┐ │
│  │ Kaufpreis│ │Reparatur.│ │Ersatzteile│ │  Gesamt investiert  │ │
│  │          │ │          │ │           │ │                     │ │
│  │ 12.000 € │ │  2.000 € │ │  1.400 € │ │     15.400 €        │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────────────────┘ │
│  (weiß/grau)  (weiß/grau)  (weiß/grau)  (blau hervorgehoben)    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ 🔧  TÜV / Pickerl                                        │    │
│  │     Fällig am 12.05.2026                                 │    │
│  └──────────────────────────────────────────────────────────┘    │
│  (gelber/oranger Rand bei < 60 Tage, roter Rand bei abgelaufen)  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ (Notizen-Banner — gelb, nur sichtbar wenn Notizen da)    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ══ PROBLEME (3) ══════════════════════════  [+ Problem melden]  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ [Offen]  12.04.2026  150,00 €        [→ In Bearb.] [✕]  │    │
│  │ Bremsscheiben verschlissen                                │    │
│  │ Vorne links und rechts müssen getauscht werden.           │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ [In Bearb.]  08.03.2026  80,00 €         [→ Gelöst] [✕] │    │
│  │ Klimaanlage kühlt nicht mehr                              │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ══ TEILE (5) ═══════════════════════════════  [+ Teil erfassen] │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ Ölfilter                               2× · [✕]          │    │
│  │ MANN-Filter · W712/75                   12.04.2026        │    │
│  │ 8,50 € / Stück = 17,00 € gesamt                          │    │
│  │ Bosch                                                     │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Inline-Formular: Problem melden

```
┌──────────────────────────────────────────────────────────────┐
│  [Titel *              ]  [Datum     12.04.2026]             │
│                                                              │
│  [Beschreibung                                             ] │
│  [                                                         ] │
│                                                              │
│  [Status ▼  Offen     ]  [Kosten (€)         0.00]         │
│                                                              │
│  Foto: [Datei auswählen]                                     │
│  [Vorschau wenn hochgeladen]                                 │
│                                                              │
│  [Speichern]  [Abbrechen]                                   │
└──────────────────────────────────────────────────────────────┘
```

## Inline-Formular: Teil erfassen

```
┌──────────────────────────────────────────────────────────────┐
│  [Name *               ]  [Kaufdatum  12.04.2026]           │
│                                                              │
│  [Teilenummer          ]  [Hersteller            ]          │
│                                                              │
│  [Preis (€)    0.00   ]  [Menge        1        ]           │
│                                                              │
│  [Lieferant                                      ]           │
│                                                              │
│  [Notizen                                      ]             │
│  [                                             ]             │
│                                                              │
│  Rechnung: [Datei auswählen]                                 │
│                                                              │
│  [Speichern]  [Abbrechen]                                   │
└──────────────────────────────────────────────────────────────┘
```

## Interaktionen

| Element | Aktion |
|---|---|
| `← Alle Fahrzeuge` | Zurück zu `/` |
| `[Bearbeiten]` | → `/fahrzeuge/{id}/bearbeiten` |
| `[+ Problem melden]` | Inline-Formular einblenden/ausblenden |
| `[→ In Bearb.]` / `[→ Gelöst]` | Status-Update via PATCH API |
| `[✕]` (Problem) | Bestätigung + DELETE via API |
| `[+ Teil erfassen]` | Inline-Formular einblenden/ausblenden |
| `[✕]` (Teil) | Bestätigung + DELETE via API |

## TÜV-Banner-Zustände

| Tage bis TÜV | Rahmenfarbe | Hintergrund |
|---|---|---|
| Abgelaufen (< 0) | `border-red-200` | `bg-red-50` |
| Kritisch (< 30) | `border-red-200` | `bg-red-50` |
| Warnung (< 60) | `border-yellow-200` | `bg-yellow-50` |
| OK (≥ 60) | `border-gray-200` | `bg-white` |
