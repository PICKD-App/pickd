/* =========================================================
   PICKD – Daten: Produkte und Automaten
   Produkte: aus der Produkttabelle (Luis Till), Nährwerte von
   Hersteller-/Händlerseiten. Bei "geprueft: false" ist der Wert
   ein Richt- oder Schätzwert und sollte noch kontrolliert werden.

   Nährwerte immer pro 100 g bzw. 100 ml angeben.
   Getränke in Plastikflasche oder Dose: "pfand: 0.25" eintragen
   (Einwegpfand Österreich). Der Preis bleibt OHNE Pfand, wie in der
   Produkttabelle. Getränkekartons (z.B. Vita Coco, Tetra Pak) haben keinen Pfand.
   Labels "High Protein" und "Zuckerfrei" werden automatisch
   berechnet (siehe config.js), "vegan" wird hier eingetragen.

   Noch unbekannte Werte: preis/einkauf: null = "Preis folgt",
   naehrwerte: null = "Nährwerte folgen". Solange Nährwerte fehlen, gilt
   "High Protein" nur mit highProteinLautHersteller: true (steht so auf der
   Packung bzw. im Produktnamen).
   ========================================================= */

window.PICKD_PRODUKTE = [
  {
    id: 'rawbite', name: 'Rawbite Riegel Cacao', kategorie: 'Riegel', emoji: '🍫',
    portion: 50, einheit: 'g', preis: 2.30, einkauf: 1.20, ust: 0.10,
    lieferant: 'Rawbite / Metro', vegan: true, gekuehlt: false,
    naehrwerte: { kcal: 443, fett: 24, kohlenhydrate: 41, zucker: 38, eiweiss: 11, salz: 0.01 },
    quelle: 'REWE-Produktseite (Herstellerangabe Rawbite)', geprueft: true
  },
  {
    id: 'more-bar', name: 'MORE Protein Riegel', kategorie: 'Riegel', emoji: '💪',
    portion: 50, einheit: 'g', preis: 2.20, einkauf: 1.15, ust: 0.10,
    lieferant: 'More Nutrition / Metro', vegan: false, gekuehlt: false,
    naehrwerte: { kcal: 356, fett: 13, kohlenhydrate: 35, zucker: 4, eiweiss: 37, salz: 0.5 },
    quelle: 'dm.de (Sorte Milky Candy Cream)', geprueft: true
  },
  {
    id: 'esn-bar', name: 'ESN Designer Bar', kategorie: 'Riegel', emoji: '🏋️',
    portion: 45, einheit: 'g', preis: 2.60, einkauf: 1.40, ust: 0.10,
    lieferant: 'ESN (B2B-Anfrage)', vegan: false, gekuehlt: false,
    naehrwerte: { kcal: 389, fett: 19.1, kohlenhydrate: 29.8, zucker: 3.3, eiweiss: 31.6, salz: 0.22 },
    quelle: 'DocMorris/medpex (Herstellerangabe ESN)', geprueft: true
  },
  {
    id: 'nussmix', name: 'Seeberger Nuss-Mix', kategorie: 'Snack', emoji: '🥜',
    portion: 40, einheit: 'g', preis: 1.70, einkauf: 0.85, ust: 0.10,
    lieferant: 'Metro / Transgourmet', vegan: true, gekuehlt: false,
    naehrwerte: { kcal: 637, fett: 54, kohlenhydrate: 11, zucker: 4.8, eiweiss: 24, salz: 0.82 },
    quelle: 'REWE (Seeberger Edel-Nuss-Mix geröstet & gesalzen)', geprueft: true
  },
  {
    id: 'fruechtemix', name: 'Seeberger Trockenfrüchte-Mix', kategorie: 'Snack', emoji: '🍇',
    portion: 50, einheit: 'g', preis: 1.70, einkauf: 0.90, ust: 0.10,
    lieferant: 'Metro / Transgourmet', vegan: true, gekuehlt: false,
    naehrwerte: { kcal: 300, fett: 1, kohlenhydrate: 68, zucker: 60, eiweiss: 2.5, salz: 0.05 },
    quelle: 'Schätzwert – genaue Sorte noch festlegen', geprueft: false
  },
  {
    id: 'riceup', name: 'Rice Up Reiswaffeln Schoko', kategorie: 'Snack', emoji: '🍘',
    portion: 60, einheit: 'g', preis: 1.40, einkauf: 0.70, ust: 0.10,
    lieferant: 'Metro / Transgourmet', vegan: false, gekuehlt: false,
    naehrwerte: { kcal: 482, fett: 21, kohlenhydrate: 64, zucker: 28, eiweiss: 7.4, salz: 0.12 },
    quelle: 'Richtwert (vergleichbare Schoko-Reiswaffeln)', geprueft: false
  },
  {
    id: 'skyr-natur', name: 'Ehrmann Skyr Natur', kategorie: 'Gekühlt', emoji: '🥣',
    portion: 250, einheit: 'g', preis: 1.80, einkauf: 0.95, ust: 0.10,
    lieferant: 'Metro / Transgourmet', vegan: false, gekuehlt: true,
    naehrwerte: { kcal: 51, fett: 0.1, kohlenhydrate: 3.6, zucker: 3.6, eiweiss: 9, salz: 0.1 },
    quelle: 'REWE (Ehrmann High Protein Skyr Natural)', geprueft: true
  },
  {
    id: 'voeslauer-still', name: 'Vöslauer still', kategorie: 'Getränk', emoji: '💧',
    portion: 500, einheit: 'ml', preis: 1.20, einkauf: 0.42, ust: 0.10, pfand: 0.25,
    lieferant: 'Getränkegroßhandel', vegan: true, gekuehlt: false,
    naehrwerte: { kcal: 0, fett: 0, kohlenhydrate: 0, zucker: 0, eiweiss: 0, salz: 0 },
    quelle: 'Mineralwasser (keine Nährwerte)', geprueft: true
  },
  {
    id: 'voeslauer-prickelnd', name: 'Vöslauer prickelnd', kategorie: 'Getränk', emoji: '🫧',
    portion: 500, einheit: 'ml', preis: 1.20, einkauf: 0.42, ust: 0.10, pfand: 0.25,
    lieferant: 'Getränkegroßhandel', vegan: true, gekuehlt: false,
    naehrwerte: { kcal: 0, fett: 0, kohlenhydrate: 0, zucker: 0, eiweiss: 0, salz: 0 },
    quelle: 'Mineralwasser (keine Nährwerte)', geprueft: true
  },
  {
    id: 'roemerquelle', name: 'Römerquelle Emotion zuckerfrei', kategorie: 'Getränk', emoji: '🍋',
    portion: 500, einheit: 'ml', preis: 1.70, einkauf: 0.60, ust: 0.20, pfand: 0.25,
    lieferant: 'Getränkegroßhandel', vegan: true, gekuehlt: false,
    naehrwerte: { kcal: 1, fett: 0, kohlenhydrate: 0, zucker: 0, eiweiss: 0, salz: 0 },
    quelle: 'eurogast Datenblatt (Sorte Zitrone-Limette)', geprueft: true
  },
  {
    id: 'coke-zero', name: 'Coca-Cola Zero Dose', kategorie: 'Getränk', emoji: '🥤',
    portion: 330, einheit: 'ml', preis: 1.70, einkauf: 0.62, ust: 0.20, pfand: 0.25,
    lieferant: 'Getränkegroßhandel / Metro', vegan: true, gekuehlt: false,
    naehrwerte: { kcal: 0.2, fett: 0, kohlenhydrate: 0, zucker: 0, eiweiss: 0, salz: 0.02 },
    quelle: 'Eurogast-Datenblatt & REWE (Herstellerangabe Coca-Cola)', geprueft: true
  },
  {
    id: 'redbull-sf', name: 'Red Bull Sugarfree', kategorie: 'Getränk', emoji: '⚡',
    portion: 250, einheit: 'ml', preis: 2.20, einkauf: 1.00, ust: 0.20, pfand: 0.25,
    lieferant: 'Getränkegroßhandel / Metro', vegan: true, gekuehlt: false,
    naehrwerte: { kcal: 3, fett: 0, kohlenhydrate: 0, zucker: 0, eiweiss: 0, salz: 0.1 },
    quelle: 'dm.at (Herstellerangabe Red Bull Sugarfree 250 ml)', geprueft: true
  },
  {
    id: 'vitacoco', name: 'Vita Coco Kokoswasser', kategorie: 'Getränk', emoji: '🥥',
    portion: 330, einheit: 'ml', preis: 2.40, einkauf: 1.25, ust: 0.20,
    lieferant: 'Metro / Transgourmet', vegan: true, gekuehlt: false,
    naehrwerte: { kcal: 18, fett: 0, kohlenhydrate: 5, zucker: 5, eiweiss: 0, salz: 0.04 },
    quelle: 'REWE (Vita Coco Kokoswasser)', geprueft: true
  },
  {
    id: 'monster-ultra', name: 'Monster Ultra White', kategorie: 'Getränk', emoji: '🔋',
    portion: 500, einheit: 'ml', preis: 2.20, einkauf: 1.00, ust: 0.20, pfand: 0.25,
    lieferant: 'Getränkegroßhandel / Metro', vegan: false, gekuehlt: false,
    naehrwerte: { kcal: 2, fett: 0, kohlenhydrate: 0.9, zucker: 0, eiweiss: 0, salz: 0.2 },
    quelle: 'REWE (Monster Energy Ultra White)', geprueft: true
  },
  {
    id: 'risbellis', name: 'Risbellis Honig', kategorie: 'Snack', emoji: '🍯',
    portion: 40, einheit: 'g', preis: 1.30, einkauf: 0.60, ust: 0.10,
    lieferant: 'Metro / Transgourmet', vegan: false, gekuehlt: false,
    naehrwerte: { kcal: 405, fett: 1.5, kohlenhydrate: 89, zucker: 17, eiweiss: 7.5, salz: 0.01 },
    quelle: 'wikifit/fatsecret (keine Herstellerangabe gefunden)', geprueft: false
  },
  {
    id: 'skyr-heidelbeere', name: 'Ehrmann Skyr Heidelbeere', kategorie: 'Gekühlt', emoji: '🫐',
    portion: 400, einheit: 'g', preis: 2.30, einkauf: 1.20, ust: 0.10,
    lieferant: 'Metro / Transgourmet', vegan: false, gekuehlt: true,
    naehrwerte: { kcal: 60, fett: 0.3, kohlenhydrate: 6, zucker: 5.5, eiweiss: 10, salz: 0.1 },
    quelle: 'Richtwert (Ehrmann High Protein Joghurt Heidelbeere, nicht Skyr) – Packung prüfen', geprueft: false
  },
  {
    id: 'sandwich-lachs', name: 'Sandwich Lachs, Salat, Ei', kategorie: 'Gekühlt', emoji: '🥪',
    portion: 180, einheit: 'g', preis: 3.50, einkauf: 1.90, ust: 0.10,
    lieferant: 'Frischeanbieter / Bäckerei', vegan: false, gekuehlt: true,
    naehrwerte: { kcal: 220, fett: 10, kohlenhydrate: 22, zucker: 3, eiweiss: 11, salz: 1.2 },
    quelle: 'Schätzwert – hängt vom Bäcker ab', geprueft: false
  },

  /* ---------- Neu laut Team-Liste (17.11.2026): Preis, Einkauf und Nährwerte folgen ---------- */
  {
    id: 'risbellis-apfel', name: 'Risbellis Apfel', kategorie: 'Snack', emoji: '🍏',
    portion: 40, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: false,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'rice-krispies', name: 'Kellogg\'s Rice Krispies', kategorie: 'Snack', emoji: '🍚',
    portion: 40, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: false,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'barebells', name: 'Barebells Proteinriegel', kategorie: 'Riegel', emoji: '🍫',
    portion: 55, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: false,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'power-system-joghurt', name: 'Power System Proteinriegel Joghurt', kategorie: 'Riegel', emoji: '🥛',
    portion: 35, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: false,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'isostar-hp', name: 'Isostar High Protein Riegel', kategorie: 'Riegel', emoji: '🏃',
    portion: 35, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: false, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'babybel-hp', name: 'Mini Babybel High Protein', kategorie: 'Snack', emoji: '🧀',
    portion: 140, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'salanettis-hp', name: 'Sorger Salanettis High Protein', kategorie: 'Snack', emoji: '🥓',
    portion: 75, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: false, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'milsani-kaese-hp', name: 'Milsani High Protein Käsescheiben', kategorie: 'Gekühlt', emoji: '🧀',
    portion: 150, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'cottage-cheese', name: 'Alpengut Cottage Cheese Leicht', kategorie: 'Gekühlt', emoji: '🥣',
    portion: 250, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'ehrmann-pudding-hp', name: 'Ehrmann High Protein Pudding Schoko', kategorie: 'Gekühlt', emoji: '🍮',
    portion: 200, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'noem-skyr-vanille', name: 'nöm PRO Protein Skyr Vanille', kategorie: 'Gekühlt', emoji: '🥄',
    portion: 200, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'milbona-drink-vanille', name: 'Milbona High-Protein Drink Vanille', kategorie: 'Getränk', emoji: '🥛',
    portion: 350, einheit: 'ml', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'noem-drink-erdbeere', name: 'nöm PRO Proteindrink Skyr Erdbeere', kategorie: 'Getränk', emoji: '🍓',
    portion: 250, einheit: 'ml', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'milsani-pudding-hp', name: 'Milsani High Protein Pudding Schoko', kategorie: 'Gekühlt', emoji: '🍫',
    portion: 200, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'milbona-pudding-hp', name: 'Milbona High-Protein Pudding Vanille', kategorie: 'Gekühlt', emoji: '🍮',
    portion: 200, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'milsani-topfen', name: 'Milsani Protein Topfencreme Erdbeere', kategorie: 'Gekühlt', emoji: '🍓',
    portion: 235, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'spar-joghurt-hp', name: 'Spar High Protein Joghurt Natur', kategorie: 'Gekühlt', emoji: '🥛',
    portion: 200, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'milbona-milchreis-hp', name: 'Milbona High-Protein Milchreis', kategorie: 'Gekühlt', emoji: '🍚',
    portion: 200, einheit: 'g', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'noem-pro35-banane', name: 'nöm PRO 35 Proteingetränk Banane', kategorie: 'Getränk', emoji: '🍌',
    portion: 350, einheit: 'ml', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'schaerdinger-kakao', name: 'Schärdinger Protein Traum Kakao', kategorie: 'Getränk', emoji: '🥤',
    portion: 330, einheit: 'ml', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  },
  {
    id: 'emmi-latte-hp', name: 'Emmi High Protein Latte Kaffee', kategorie: 'Getränk', emoji: '☕',
    portion: 230, einheit: 'ml', preis: null, einkauf: null, ust: 0.10,
    lieferant: 'offen', vegan: false, gekuehlt: true, highProteinLautHersteller: true,
    naehrwerte: null,
    quelle: 'Team-Liste (Teams-Chat, 17.11.2026) – Nährwerte noch von der Packung abschreiben', geprueft: false
  }
];

/* Automaten: Standort, Koordinaten (OpenStreetMap) und Sortiment.
   typ: schule | gym | bahnhof | einkaufszentrum  */
window.PICKD_AUTOMATEN = [
  {
    id: 'hak', name: 'HAK St. Pölten', typ: 'schule',
    adresse: 'Bundesschulzentrum, Waldstraße, 3100 St. Pölten',
    koordinaten: [48.20731, 15.61943], gekuehlt: true,
    beschreibung: 'Im Schulgebäude der HAK/HAS',
    sortiment: [
      'rawbite', 'more-bar', 'esn-bar', 'nussmix', 'fruechtemix', 'riceup', 'skyr-natur', 'voeslauer-still',
      'voeslauer-prickelnd', 'roemerquelle', 'coke-zero', 'vitacoco', 'risbellis', 'risbellis-apfel',
      'rice-krispies', 'barebells', 'power-system-joghurt', 'isostar-hp', 'babybel-hp', 'salanettis-hp',
      'ehrmann-pudding-hp', 'noem-skyr-vanille', 'milbona-drink-vanille', 'noem-drink-erdbeere',
      'milsani-pudding-hp', 'milbona-pudding-hp', 'milsani-topfen', 'spar-joghurt-hp', 'noem-pro35-banane',
      'schaerdinger-kakao'
    ]
  },
  {
    id: 'htl', name: 'HTL St. Pölten', typ: 'schule',
    adresse: 'Waldstraße 3, 3100 St. Pölten',
    koordinaten: [48.20706, 15.61869], gekuehlt: true,
    beschreibung: 'Im Schulgebäude der HTL',
    sortiment: [
      'rawbite', 'more-bar', 'esn-bar', 'nussmix', 'riceup', 'skyr-natur', 'voeslauer-still',
      'voeslauer-prickelnd', 'roemerquelle', 'coke-zero', 'vitacoco', 'risbellis', 'skyr-heidelbeere',
      'rice-krispies', 'barebells', 'power-system-joghurt', 'isostar-hp', 'babybel-hp', 'salanettis-hp',
      'ehrmann-pudding-hp', 'noem-skyr-vanille', 'milbona-drink-vanille', 'noem-drink-erdbeere',
      'milsani-pudding-hp', 'milbona-pudding-hp', 'milsani-topfen', 'spar-joghurt-hp',
      'milbona-milchreis-hp', 'noem-pro35-banane', 'schaerdinger-kakao'
    ]
  },
  {
    id: 'speedfit', name: 'Speedfit St. Pölten Nord', typ: 'gym',
    adresse: 'Dr.-Doch-Gasse 3, 3107 St. Pölten',
    koordinaten: [48.21940, 15.64429], gekuehlt: true,
    beschreibung: 'Im Fitnessstudio beim Eingang',
    sortiment: [
      'rawbite', 'more-bar', 'esn-bar', 'nussmix', 'skyr-natur', 'voeslauer-still', 'voeslauer-prickelnd',
      'roemerquelle', 'redbull-sf', 'vitacoco', 'monster-ultra', 'skyr-heidelbeere', 'barebells',
      'power-system-joghurt', 'isostar-hp', 'babybel-hp', 'salanettis-hp', 'milsani-kaese-hp',
      'cottage-cheese', 'ehrmann-pudding-hp', 'noem-skyr-vanille', 'milbona-drink-vanille',
      'noem-drink-erdbeere', 'milsani-pudding-hp', 'milbona-pudding-hp', 'milsani-topfen', 'spar-joghurt-hp',
      'noem-pro35-banane', 'schaerdinger-kakao', 'emmi-latte-hp'
    ]
  },
  {
    id: 'hbf', name: 'Hauptbahnhof St. Pölten', typ: 'bahnhof',
    adresse: 'Bahnhofplatz 1, 3100 St. Pölten',
    koordinaten: [48.20828, 15.62468], gekuehlt: true,
    beschreibung: 'In der Bahnhofshalle',
    sortiment: [
      'rawbite', 'more-bar', 'esn-bar', 'nussmix', 'fruechtemix', 'riceup', 'skyr-natur', 'voeslauer-still',
      'voeslauer-prickelnd', 'roemerquelle', 'coke-zero', 'redbull-sf', 'vitacoco', 'monster-ultra',
      'risbellis', 'sandwich-lachs', 'risbellis-apfel', 'rice-krispies', 'barebells', 'power-system-joghurt',
      'isostar-hp', 'babybel-hp', 'salanettis-hp', 'ehrmann-pudding-hp', 'noem-skyr-vanille',
      'milbona-drink-vanille', 'noem-drink-erdbeere', 'noem-pro35-banane', 'schaerdinger-kakao',
      'emmi-latte-hp'
    ]
  },
  {
    id: 'ekz-sued', name: 'EKZ Süd St. Pölten', typ: 'einkaufszentrum',
    adresse: 'Rödlgasse, 3100 St. Pölten',
    koordinaten: [48.18225, 15.62086], gekuehlt: true,
    beschreibung: 'Im Einkaufszentrum',
    sortiment: [
      'rawbite', 'more-bar', 'esn-bar', 'nussmix', 'fruechtemix', 'riceup', 'skyr-natur', 'voeslauer-still',
      'voeslauer-prickelnd', 'roemerquelle', 'coke-zero', 'vitacoco', 'risbellis', 'skyr-heidelbeere',
      'sandwich-lachs', 'risbellis-apfel', 'rice-krispies', 'barebells', 'babybel-hp', 'ehrmann-pudding-hp',
      'noem-skyr-vanille', 'milbona-drink-vanille', 'noem-drink-erdbeere', 'milsani-pudding-hp',
      'milbona-pudding-hp', 'milsani-topfen', 'spar-joghurt-hp', 'noem-pro35-banane', 'schaerdinger-kakao',
      'emmi-latte-hp'
    ]
  }
];

/* Anzeigenamen und Symbole der Standorttypen */
window.PICKD_TYPEN = {
  schule: { name: 'Schule', emoji: '🎓' },
  gym: { name: 'Fitnessstudio', emoji: '🏋️' },
  bahnhof: { name: 'Bahnhof', emoji: '🚉' },
  einkaufszentrum: { name: 'Einkaufszentrum', emoji: '🛍️' }
};
