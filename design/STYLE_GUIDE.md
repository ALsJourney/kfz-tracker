# KFZ-Tracker — Stilhandbuch für Entwickler

> Referenz für alle, die neue Seiten oder Komponenten zu KFZ-Tracker beitragen.

---

## Schnellreferenz: Tailwind-Klassen

### Buttons

```tsx
// Primär-Button
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
  Speichern
</button>

// Sekundär-Button
<button className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
  Abbrechen
</button>

// Destruktiver Button (Löschen)
<button className="text-sm text-red-600 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
  Löschen
</button>

// Icon-Button (min. 44×44px)
<button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Schließen">
  ✕
</button>
```

### Karten

```tsx
// Standard-Karte
<div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
  {/* Inhalt */}
</div>

// Karte mit Hover (klickbar)
<div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
  {/* Inhalt */}
</div>

// Hervorgehobene Karte (z.B. Gesamt-Investition)
<div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
  {/* Inhalt */}
</div>
```

### Badges / Status-Indikatoren

```tsx
// Allgemeiner Badge
<span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700">
  Label
</span>

// TÜV-Status
// Abgelaufen:
<span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-700">Abgelaufen</span>
// Bald fällig:
<span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-700">23 Tage</span>
// OK:
<span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">12.05.2026</span>

// Problem-Status
// Offen:
<span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">Offen</span>
// In Bearbeitung:
<span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-700">In Bearbeitung</span>
// Gelöst:
<span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">Gelöst</span>
```

### Formularfelder

```tsx
// Text-Input
<div>
  <label htmlFor="titel" className="block text-xs font-medium text-gray-600 mb-1">
    Titel *
  </label>
  <input
    id="titel"
    name="titel"
    required
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="z.B. Bremsscheiben verschlissen"
  />
</div>

// Select
<select
  name="status"
  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
>
  <option value="offen">Offen</option>
  <option value="in_bearbeitung">In Bearbeitung</option>
  <option value="geloest">Gelöst</option>
</select>

// Textarea
<textarea
  name="beschreibung"
  rows={3}
  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
/>

// Fehlermeldung
<p className="text-red-600 text-xs mt-1">Dieses Feld ist erforderlich.</p>
```

### Benachrichtigungsbanner

```tsx
// Info
<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
  <span className="text-blue-600 text-lg">ℹ️</span>
  <p className="text-sm text-blue-800">{text}</p>
</div>

// Warnung (TÜV bald fällig)
<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
  <span className="text-lg">⚠️</span>
  <p className="text-sm text-yellow-800">{text}</p>
</div>

// Kritisch (TÜV abgelaufen)
<div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
  <span className="text-lg">🚨</span>
  <p className="text-sm text-red-800">{text}</p>
</div>

// Notizen (neutral-gelb)
<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
  <p className="text-sm text-yellow-800">{text}</p>
</div>
```

### Leer-Zustände

```tsx
// Standard-Leerzustand
<div className="text-center py-10 bg-white rounded-xl border border-gray-200">
  <div className="text-4xl mb-3">🔧</div>
  <h3 className="text-base font-semibold text-gray-700 mb-1">Noch keine Probleme erfasst</h3>
  <p className="text-sm text-gray-500">Melde das erste Problem für dieses Fahrzeug.</p>
</div>

// Mit CTA
<div className="text-center py-20 bg-white rounded-xl border border-gray-200">
  <div className="text-5xl mb-4">🚗</div>
  <h2 className="text-xl font-semibold text-gray-700 mb-2">Noch keine Fahrzeuge</h2>
  <p className="text-gray-500 mb-6">Füge dein erstes Fahrzeug hinzu, um loszulegen.</p>
  <a href="/fahrzeuge/neu" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block">
    Fahrzeug hinzufügen
  </a>
</div>
```

---

## Layout-Konventionen

### Seitenstruktur

```tsx
// Standard-Seitenstruktur
export default function Page() {
  return (
    <div>
      {/* Kopfzeile */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seitentitel</h1>
          <p className="text-sm text-gray-500 mt-1">Optionale Unterzeile</p>
        </div>
        {/* Optionale Aktion */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          + Hinzufügen
        </button>
      </div>

      {/* Inhalt */}
    </div>
  );
}
```

### Grid-Layouts

```tsx
// 2-spaltiges Fahrzeug-Grid
<div className="grid gap-4 md:grid-cols-2">
  {/* Elemente */}
</div>

// 4-spaltiges Kosten-Grid (Fahrzeugdetails)
<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
  {/* Kacheln */}
</div>

// 2-spaltiges Formular-Grid
<div className="grid grid-cols-2 gap-3">
  {/* Felder */}
</div>
```

---

## Sprachliche Konventionen (Deutsch)

| Begriff | Verwendung |
|---|---|
| Fahrzeug | Singular; Fahrzeuge = Plural |
| Problem melden | Aktion für neues Problem |
| Bearbeiten | Edit-Aktion |
| Löschen | Delete-Aktion |
| Speichern | Save-Aktion |
| Abbrechen | Cancel-Aktion |
| TÜV | Deutschland; Pickerl = Österreich |
| Marke | Hersteller/Brand |
| Kennzeichen | Nummernschild |
| Baujahr | Jahr der Herstellung |
| Kilometerstand | Aktueller Kilometerstand |

---

## Kontrast-Checkliste

Vor jedem PR prüfen:

- [ ] Primärtext auf weißem Hintergrund: `#111827` auf `#FFFFFF` → 16.1:1 ✅
- [ ] Muted-Text: `#6B7280` auf `#FFFFFF` → 5.9:1 ✅
- [ ] Primär-Button: `#FFFFFF` auf `#1A56DB` → 5.3:1 ✅
- [ ] Danger-Badge: `#C81E1E` auf `#FDF2F2` → 4.7:1 ✅
- [ ] Warning-Badge: `#9F580A` auf `#FFFBEB` → 5.1:1 ✅
- [ ] Success-Badge: `#057A55` auf `#F3FAF7` → 5.4:1 ✅
