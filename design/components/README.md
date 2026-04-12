# KFZ-Tracker — Komponenten-Dokumentation

## Bestehende Komponenten

### `UploadButton` (`components/UploadButton.tsx`)

Datei-Upload-Button mit Fortschrittsanzeige.

**Props:**
```tsx
interface UploadButtonProps {
  onUploaded: (pfad: string) => void;  // Callback mit dem zurückgegebenen Dateipfad
  accept?: string;                      // MIME-Typ-Filter, z.B. "image/*" oder ".pdf"
}
```

**Verwendung:**
```tsx
<UploadButton
  onUploaded={(pfad) => setFotoPfad(pfad)}
  accept="image/*"
/>
```

**Upload-Endpoint:** `POST /api/upload` — gibt `{ pfad: string }` zurück.

**Design-Anforderungen:**
- Button: `border border-gray-300 rounded-lg px-3 py-2 text-sm`
- Lade-Zustand: deaktiviert mit Spinner-Text
- Unterstützte Formate klar kommunizieren

---

### `ProblemSection` (`app/fahrzeuge/[id]/ProblemSection.tsx`)

Client-Komponente für die Problemliste + Inline-Formular.

**Props:**
```tsx
interface ProblemSectionProps {
  fahrzeugId: string;
  initialProbleme: Problem[];
}
```

**Funktionen:**
- Problem hinzufügen (POST `/api/fahrzeuge/{id}/probleme`)
- Status ändern (PATCH `/api/fahrzeuge/{id}/probleme?problemId={pid}`)
- Problem löschen (DELETE `/api/fahrzeuge/{id}/probleme?problemId={pid}`)

**Bekannte Verbesserungen:**
- `window.confirm` → `ConfirmDialog`-Komponente ersetzen
- Foto-Vorschau beim Edit fehlt
- Optimistic Updates für sofortiges UI-Feedback

---

### `TeileSection` (`app/fahrzeuge/[id]/TeileSection.tsx`)

Client-Komponente für die Teile-Liste + Inline-Formular.

**Props:**
```tsx
interface TeileSectionProps {
  fahrzeugId: string;
  initialTeile: Teil[];
}
```

**Funktionen:**
- Teil hinzufügen (POST `/api/fahrzeuge/{id}/teile`)
- Teil löschen (DELETE `/api/fahrzeuge/{id}/teile?teilId={tid}`)

**Bekannte Verbesserungen:**
- Bearbeiten eines Teils noch nicht möglich
- Rechnung-Vorschau fehlt (nur Upload, kein View)
- `window.confirm` → `ConfirmDialog`

---

## Empfohlene neue Komponenten

### `StatusBadge`

Wiederverwendbarer Badge für verschiedene Status-Typen.

```tsx
type StatusBadgeVariant = 
  | 'offen'           // rot
  | 'in_bearbeitung'  // gelb
  | 'geloest'         // grün
  | 'tuev_ok'         // grün
  | 'tuev_bald'       // gelb/orange
  | 'tuev_abgelaufen' // rot

interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  label?: string;  // Override des Standard-Labels
}
```

**Beispiel-Implementierung:**
```tsx
const BADGE_STYLES: Record<StatusBadgeVariant, string> = {
  offen:           'bg-red-100 text-red-700',
  in_bearbeitung:  'bg-yellow-100 text-yellow-700',
  geloest:         'bg-green-100 text-green-700',
  tuev_ok:         'bg-green-100 text-green-700',
  tuev_bald:       'bg-yellow-100 text-yellow-700',
  tuev_abgelaufen: 'bg-red-100 text-red-700',
};

const BADGE_LABELS: Record<StatusBadgeVariant, string> = {
  offen:           'Offen',
  in_bearbeitung:  'In Bearbeitung',
  geloest:         'Gelöst',
  tuev_ok:         'TÜV OK',
  tuev_bald:       'TÜV bald',
  tuev_abgelaufen: 'TÜV abgelaufen',
};

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_STYLES[variant]}`}>
      {label ?? BADGE_LABELS[variant]}
    </span>
  );
}
```

---

### `EmptyState`

Leer-Zustand mit Icon und optionalem CTA.

```tsx
interface EmptyStateProps {
  icon: string;         // Emoji oder Icon-Komponente
  title: string;        // Haupttext
  description?: string; // Untertext
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}
```

---

### `TuevAlert`

Farblich kodiertes Banner für ablaufende/abgelaufene TÜV-Termine.

```tsx
interface TuevAlertProps {
  datum: string;  // ISO-Datumsstring
}
```

**Logik:**
```
daysUntil < 0   → "TÜV/Pickerl ist abgelaufen!" (rot)
daysUntil < 30  → "TÜV/Pickerl läuft in {n} Tagen ab!" (orange)
daysUntil < 60  → "TÜV/Pickerl läuft in {n} Tagen ab." (gelb)
daysUntil >= 60 → null (Banner nicht anzeigen)
```

---

### `ConfirmDialog`

Bestätigungsdialog als Ersatz für `window.confirm`.

```tsx
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;   // Default: "Löschen"
  cancelLabel?: string;    // Default: "Abbrechen"
  variant?: 'danger' | 'warning';  // Default: 'danger'
  onConfirm: () => void;
  onCancel: () => void;
}
```

---

### `CostTile`

Einzelne Kosten-Kachel für die Fahrzeugdetail-Seite.

```tsx
interface CostTileProps {
  label: string;
  amount: number;
  highlight?: boolean;  // true = blaue Hervorhebung (Gesamt-Kachel)
}
```

---

## Datei-Organisation

```
components/
├── UploadButton.tsx         ← Bestehend
├── StatusBadge.tsx          ← Neu (empfohlen)
├── EmptyState.tsx           ← Neu (empfohlen)
├── TuevAlert.tsx            ← Neu (empfohlen)
├── ConfirmDialog.tsx        ← Neu (empfohlen)
└── CostTile.tsx             ← Neu (empfohlen)
```
