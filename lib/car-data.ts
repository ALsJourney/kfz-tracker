export const MARKEN = [
  "Audi",
  "BMW",
  "Citroen",
  "Dacia",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Kia",
  "Mazda",
  "Mercedes-Benz",
  "Mini",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Seat",
  "Skoda",
  "Smart",
  "Suzuki",
  "Toyota",
  "Volvo",
  "Volkswagen",
] as const;

export const MODELLE: Record<string, string[]> = {
  Audi: ["A3", "A4", "A5", "A6", "A7", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron", "TT", "R8"],
  BMW: ["1er", "2er", "3er", "4er", "5er", "7er", "X1", "X2", "X3", "X5", "X6", "X7", "i3", "i4", "iX"],
  Citroen: ["C1", "C3", "C4", "C5 Aircross", "C5 X", "Berlingo", "Jumpy"],
  Dacia: ["Sandero", "Duster", "Jogger", "Spring"],
  Fiat: ["500", "500e", "Panda", "Tipo", "Ducato", "500X"],
  Ford: ["Fiesta", "Focus", "Puma", "Kuga", "Mondeo", "Mustang", "Transit", "Tourneo"],
  Honda: ["Civic", "CR-V", "HR-V", "Jazz", "e"],
  Hyundai: ["i10", "i20", "i30", "Kona", "Tucson", "Ioniq 5", "Ioniq 6", "Bayon"],
  Kia: ["Picanto", "Rio", "Ceed", "Niro", "Sportage", "Sorento", "EV6", "EV9"],
  Mazda: ["2", "3", "CX-3", "CX-5", "CX-30", "CX-60", "MX-5", "6"],
  "Mercedes-Benz": ["A-Klasse", "B-Klasse", "C-Klasse", "E-Klasse", "S-Klasse", "GLA", "GLB", "GLC", "GLE", "GLS", "EQC", "V-Klasse", "Sprinter"],
  Mini: ["Cooper", "Cooper S", "One", "Clubman", "Countryman", "Electric"],
  Nissan: ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Ariya"],
  Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Vivaro", "Zafira"],
  Peugeot: ["208", "308", "408", "2008", "3008", "5008", "Rifter", "Partner"],
  Porsche: ["911", "Cayenne", "Macan", "Taycan", "Panamera", "718 Boxster", "718 Cayman"],
  Renault: ["Clio", "Captur", "Megane", "Arkana", "Austral", "Espace", "Kadjar", "Zoe"],
  Seat: ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Mii", "Formentor"],
  Skoda: ["Fabia", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
  Smart: ["Fortwo", "Forfour", "#1", "#3"],
  Suzuki: ["Swift", "Vitara", "S-Cross", "Ignis", "Jimny"],
  Toyota: ["Yaris", "Corolla", "RAV4", "Camry", "Prius", "C-HR", "Aygo X", "Hilux", "Land Cruiser", "bZ4X"],
  Volvo: ["XC40", "XC60", "XC90", "S60", "S90", "V40", "V60", "V90", "EX30", "EX90"],
  Volkswagen: ["Golf", "Polo", "Passat", "Tiguan", "T-Roc", "Touran", "Touareg", "ID.3", "ID.4", "ID.5", "ID. Buzz", "Up!", "Taigo", "Arteon"],
};

export const FARBEN = [
  { value: "Schwarz", label: "Schwarz" },
  { value: "Weiß", label: "Weiß" },
  { value: "Silber", label: "Silber" },
  { value: "Grau", label: "Grau" },
  { value: "Rot", label: "Rot" },
  { value: "Blau", label: "Blau" },
  { value: "Grün", label: "Grün" },
  { value: "Braun", label: "Braun" },
  { value: "Beige", label: "Beige" },
  { value: "Orange", label: "Orange" },
  { value: "Gelb", label: "Gelb" },
  { value: "Violett", label: "Violett" },
] as const;

export const BAUJAHR_RANGE: number[] = [];
for (let y = new Date().getFullYear() + 1; y >= 1970; y--) {
  BAUJAHR_RANGE.push(y);
}

export const MONATE = [
  { value: "01", label: "Januar" },
  { value: "02", label: "Februar" },
  { value: "03", label: "März" },
  { value: "04", label: "April" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Dezember" },
] as const;

export const TUEV_JAHRE: number[] = [];
const currentYear = new Date().getFullYear();
for (let y = currentYear; y <= currentYear + 10; y++) {
  TUEV_JAHRE.push(y);
}

export function composeTuevDatum(monat: string, jahr: string): string {
  return `${jahr}-${monat}`;
}

export function parseTuevDatum(datum: string): { monat: string; jahr: string } {
  const parts = datum.split("-");
  return { jahr: parts[0], monat: parts[1] };
}

export function formatTuevDatumDisplay(datum: string | null): string {
  if (!datum) return "";
  const { monat, jahr } = parseTuevDatum(datum);
  const monatObj = MONATE.find((m) => m.value === monat);
  return `${monatObj?.label ?? monat} ${jahr}`;
}