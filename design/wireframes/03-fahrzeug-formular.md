# Wireframe: Fahrzeug anlegen / bearbeiten

## Routen
- Neu: `/fahrzeuge/neu`
- Bearbeiten: `/fahrzeuge/[id]/bearbeiten`

## Desktop-Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER: 🚗 KFZ-Tracker               [+ Fahrzeug hinzufügen]    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ← Zurück                                                         │
│                                                                   │
│  Neues Fahrzeug                                                   │
│  (oder "BMW 3er bearbeiten" beim Edit-Flow)                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │  [Marke *                    ]  [Modell *              ] │    │
│  │                                                          │    │
│  │  [Baujahr       z.B. 2018   ]  [Kennzeichen  B-AB 1234] │    │
│  │                                                          │    │
│  │  [Farbe         z.B. Schwarz]  [Kaufpreis €  12000.00 ] │    │
│  │                                                          │    │
│  │  [Kilometerstand  145000    ]  [TÜV/Pickerl  2026-05-12]│    │
│  │                                  (type="date")           │    │
│  │                                                          │    │
│  │  Notizen:                                                │    │
│  │  [                                                      ]│    │
│  │  [                                                      ]│    │
│  │  [                                                      ]│    │
│  │                                                          │    │
│  │  [Fahrzeug speichern]   [Abbrechen]                     │    │
│  │  (nur beim Edit: auch [Fahrzeug löschen] ganz rechts)   │    │
│  │                                                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Mobile-Layout

```
┌─────────────────────────┐
│ 🚗 KFZ-Tracker   [+ Add]│
├─────────────────────────┤
│                         │
│ ← Zurück                │
│                         │
│ Neues Fahrzeug          │
│                         │
│ ┌─────────────────────┐ │
│ │                     │ │
│ │ Marke *             │ │
│ │ [                 ] │ │
│ │                     │ │
│ │ Modell *            │ │
│ │ [                 ] │ │
│ │                     │ │
│ │ Baujahr             │ │
│ │ [                 ] │ │
│ │                     │ │
│ │ Kennzeichen         │ │
│ │ [                 ] │ │
│ │                     │ │
│ │ Farbe               │ │
│ │ [                 ] │ │
│ │                     │ │
│ │ Kaufpreis (€)       │ │
│ │ [                 ] │ │
│ │                     │ │
│ │ Kilometerstand      │ │
│ │ [                 ] │ │
│ │                     │ │
│ │ TÜV / Pickerl       │ │
│ │ [    date picker  ] │ │
│ │                     │ │
│ │ Notizen             │ │
│ │ [               ]  │ │
│ │ [               ]  │ │
│ │                     │ │
│ │ [Fahrzeug speichern]│ │
│ │ [Abbrechen        ] │ │
│ │                     │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## Felder & Validierung

| Feld | Type | Pflichtfeld | Validierung |
|---|---|---|---|
| Marke | text | ✅ | min. 1 Zeichen |
| Modell | text | ✅ | min. 1 Zeichen |
| Baujahr | number | ❌ | 1900–2099 |
| Kennzeichen | text | ❌ | — |
| Farbe | text | ❌ | — |
| Kaufpreis | number | ❌ | ≥ 0, step=0.01 |
| Kilometerstand | number | ❌ | ≥ 0, integer |
| TÜV/Pickerl Datum | date | ❌ | — |
| Notizen | textarea | ❌ | — |

## Interaktionen

| Element | Aktion |
|---|---|
| `← Zurück` | Zurück (Neu: `/`; Bearbeiten: `/fahrzeuge/{id}`) |
| `[Fahrzeug speichern]` | POST `/api/fahrzeuge` (neu) oder PATCH `/api/fahrzeuge/{id}` (edit) |
| `[Abbrechen]` | Zurücknavigieren ohne Speichern |
| `[Fahrzeug löschen]` | Bestätigung anzeigen, dann DELETE `/api/fahrzeuge/{id}`, dann `/` |

## Zustände

- **Laden:** Button disabled, Text "Wird gespeichert..."
- **Fehler:** Inline-Fehler unter dem Feld in `text-red-600 text-xs`
- **Erfolg (Neu):** Redirect zu `/fahrzeuge/{neue-id}`
- **Erfolg (Edit):** Redirect zu `/fahrzeuge/{id}`
