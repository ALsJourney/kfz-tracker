# Wireframe: Dashboard — Fahrzeugliste (`/`)

## Desktop (≥ 768px)

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER                                                            │
│  🚗 KFZ-Tracker                    [+ Fahrzeug hinzufügen]       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Meine Fahrzeuge                                                  │
│  Gesamtinvestition: 28.750,00 €                                  │
│                                                                   │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│  │ BMW 3er              TÜV:  │ │ VW Golf              TÜV:  │ │
│  │ 2018 · B-AB 1234    23 Tg. │ │ 2015 · MUC-XY 789  OK      │ │
│  │ (orange Badge)              │ │ (grüner Badge)              │ │
│  │─────────────────────────────│ │─────────────────────────────│ │
│  │ Kaufpreis  Repar./T.  Ges. │ │ Kaufpreis  Repar./T.  Ges. │ │
│  │ 12.000€    3.400€  15.400€ │ │ 8.500€     4.850€  13.350€ │ │
│  │─────────────────────────────│ │─────────────────────────────│ │
│  │ 3 Probleme · 5 Teile        │ │ 1 Problem · 8 Teile         │ │
│  └─────────────────────────────┘ └─────────────────────────────┘ │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER: KFZ-Tracker — Open Source für den deutschsprachigen Raum │
└──────────────────────────────────────────────────────────────────┘
```

## Leer-Zustand (keine Fahrzeuge)

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER                                                            │
│  🚗 KFZ-Tracker                    [+ Fahrzeug hinzufügen]       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Meine Fahrzeuge                                                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │                      🚗                                  │    │
│  │                                                          │    │
│  │              Noch keine Fahrzeuge                        │    │
│  │    Füge dein erstes Fahrzeug hinzu, um loszulegen.       │    │
│  │                                                          │    │
│  │              [Fahrzeug hinzufügen]                       │    │
│  │                                                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Mobile (< 640px)

```
┌─────────────────────────┐
│ 🚗 KFZ-Tracker   [+ Add]│
├─────────────────────────┤
│                         │
│ Meine Fahrzeuge         │
│ Ges.: 28.750,00 €       │
│                         │
│ ┌─────────────────────┐ │
│ │ BMW 3er   TÜV:23Tg │ │
│ │ 2018 · B-AB 1234   │ │
│ │─────────────────────│ │
│ │ Kauf  Rep./T.  Ges. │ │
│ │ 12k€  3.4k€  15.4k€│ │
│ │─────────────────────│ │
│ │ 3 Prob. · 5 Teile   │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ VW Golf     TÜV:OK  │ │
│ │ ...                 │ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

## Interaktionen

| Element | Aktion |
|---|---|
| Fahrzeug-Karte | Klick → `/fahrzeuge/{id}` |
| "+ Fahrzeug hinzufügen" (Header) | Klick → `/fahrzeuge/neu` |
| "+ Fahrzeug hinzufügen" (Leer-CTA) | Klick → `/fahrzeuge/neu` |

## Zustände

- **Normal:** Grid mit 1–n Fahrzeugen
- **Leer:** Leer-Zustand-Karte mit CTA
- **Hover (Karte):** `border-blue-300 shadow-md`
