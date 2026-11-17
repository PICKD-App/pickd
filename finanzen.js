/* =========================================================
   PICKD – Finanzplan Pilotautomat Schule
   Werte aus "PICKD_Finanzplan_Pilot_Schule.xlsx" (Blatt "Annahmen" und
   "Sortiment Schule"). Ändert sich der Plan, hier die Zahlen anpassen.
   Alle Beträge netto. Preise und Einkauf stehen hier beim Sortiment, so wie
   in der Excel-Datei – unabhängig vom aktuellen Website-Sortiment (data.js).
   offen: true = in der Excel-Datei gelb markiert (noch offen / prüfen)
   ========================================================= */
window.PICKD_FINANZPLAN = {
  quelle: 'PICKD_Finanzplan_Pilot_Schule.xlsx',

  // Verkäufe pro Schultag
  szenarien: [
    { name: 'Pessimistisch', verkaeufeProTag: 20 },
    { name: 'Realistisch', verkaeufeProTag: 35 },
    { name: 'Optimistisch', verkaeufeProTag: 50 }
  ],
  gewaehltesSzenario: 1, // 0 = pessimistisch, 1 = realistisch, 2 = optimistisch (für den Liquiditätsplan)

  // Schultage pro Monat (Sep–Aug). Vereinfachung: 180 Tage gleichmäßig, Sommer = 0
  monate: ['Sep', 'Okt', 'Nov', 'Dez', 'Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug'],
  schultage: [18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 0, 0],

  // Gründungskosten (einmalig)
  gruendung: [
    { name: 'Automat Zitzmann AZ500', betrag: 6499, abschreibbar: true, herkunft: 'Anbieterpreis netto (Automaten und Technik)' },
    { name: 'Kartenleser / Telemetrie (falls nicht inkl.)', betrag: 0, abschreibbar: true, offen: true, herkunft: 'Angebot einholen' },
    { name: 'Erste Warenfüllung', betrag: 1000, lager: true, herkunft: 'Team-Schätzung' },
    { name: 'Transport und Aufstellung', betrag: 400, herkunft: 'Team-Schätzung' },
    { name: 'Branding und Beschriftung', betrag: 300, herkunft: 'Team-Schätzung' },
    { name: 'Website und Werbung zum Start', betrag: 200, herkunft: 'Team-Schätzung' }
  ],
  nutzungsdauerJahre: 5, // mit Lehrkraft (RW) abklären

  // Laufende Kosten pro Monat
  fixkosten: [
    { name: 'Standortmiete (fix)', betrag: 200, herkunft: 'bei Schule evtl. 0 € und stattdessen Umsatzbeteiligung' },
    { name: 'Strom und Internet', betrag: 50 },
    { name: 'Wartung und Reparaturen', betrag: 75 },
    { name: 'Transport und Nachfüllen', betrag: 150 },
    { name: 'Versicherung und Verwaltung', betrag: 75 },
    { name: 'Werbung und Sonstiges', betrag: 50 }
  ],
  umsatzbeteiligung: 0, // Anteil vom Nettoumsatz für die Schule (0,1 = 10 %), noch offen
  startkapital: 0,      // Eigenmittel/Finanzierung, noch offen

  // Sortiment im Schul-Automaten laut Excel (Stand vor der Erweiterung auf 38 Produkte).
  // Preis = Verkauf brutto, einkauf = netto. Gewichtung 1 = normal, 2 = doppelt so oft, 0 = nicht im Automaten
  sortiment: [
    { id: 'rawbite', name: 'Rawbite Riegel', ust: 0.1, einkauf: 1.2, preis: 2.3, gewicht: 1 },
    { id: 'more-bar', name: 'MORE Protein Riegel 50 g', ust: 0.1, einkauf: 1.15, preis: 2.2, gewicht: 1 },
    { id: 'esn-bar', name: 'ESN Designer Bar 45 g', ust: 0.1, einkauf: 1.4, preis: 2.6, gewicht: 1 },
    { id: 'bueno-white', name: 'Kinder Bueno White 39 g', ust: 0.1, einkauf: 0.85, preis: 1.6, gewicht: 1, hinweis: 'passt wenig zum USP „gesünder“ – als günstige Alternative begründen oder streichen' },
    { id: 'nussmix', name: 'Seeberger Nuss-Mix 40 g', ust: 0.1, einkauf: 0.85, preis: 1.7, gewicht: 1 },
    { id: 'fruechtemix', name: 'Seeberger Trockenfrüchte-Mix 50 g', ust: 0.1, einkauf: 0.9, preis: 1.7, gewicht: 1 },
    { id: 'riceup', name: 'Rice Up Reiswaffeln Schoko 60 g', ust: 0.1, einkauf: 0.7, preis: 1.4, gewicht: 1 },
    { id: 'skyr-natur', name: 'Ehrmann Skyr Natur 250 g', ust: 0.1, einkauf: 0.95, preis: 1.8, gewicht: 1 },
    { id: 'soletti', name: 'Soletti Salzbrezeln 40 g', ust: 0.1, einkauf: 0.55, preis: 1.2, gewicht: 1, hinweis: 'passt wenig zum USP „gesünder“ – als günstige Alternative begründen oder streichen' },
    { id: 'voeslauer-still', name: 'Vöslauer still 0,5 L', ust: 0.1, einkauf: 0.42, preis: 1.2, gewicht: 1 },
    { id: 'voeslauer-prickelnd', name: 'Vöslauer prickelnd 0,5 L', ust: 0.1, einkauf: 0.42, preis: 1.2, gewicht: 1 },
    { id: 'roemerquelle', name: 'Römerquelle Emotion zuckerfrei 0,5 L', ust: 0.2, einkauf: 0.6, preis: 1.7, gewicht: 1 },
    { id: 'coke-zero', name: 'Coca-Cola Zero 0,33 L Dose', ust: 0.2, einkauf: 0.62, preis: 1.7, gewicht: 1 },
    { id: 'redbull-sf', name: 'Red Bull Sugarfree Cherry 0,25 L Dose', ust: 0.2, einkauf: 1, preis: 2.2, gewicht: 0, hinweis: 'Energydrink – Leitlinie Schulbuffet (Sozialministerium) rät für Schulen ab' },
    { id: 'vitacoco', name: 'Vita Coco Kokoswasser 330 ml', ust: 0.2, einkauf: 1.25, preis: 2.4, gewicht: 1 },
    { id: 'monster-ultra', name: 'Monster Ultra White 0,5 L', ust: 0.2, einkauf: 1, preis: 2.2, gewicht: 0, hinweis: 'Energydrink – Leitlinie Schulbuffet (Sozialministerium) rät für Schulen ab' },
    { id: 'risbellis', name: 'Risbellis Honig', ust: 0.1, einkauf: 0.6, preis: 1.3, gewicht: 1 },
    { id: 'skyr-heidelbeere', name: 'Ehrmann Skyr Heidelbeere 400 g', ust: 0.1, einkauf: 1.2, preis: 2.3, gewicht: 1 },
    { id: 'sandwich-lachs', name: 'Sandwich Lachs, Salat, Ei', ust: 0.1, einkauf: 1.9, preis: 3.5, gewicht: 0, hinweis: 'Frischware: Kühlkette/Ablaufdatum – erst nach der Pilotphase' }
  ],

  offenePunkte: [
    'Verkäufe pro Schultag mit Umfrage und Schülerzahl der Schule begründen',
    'Kartenleser / Telemetrie: Angebot einholen (falls nicht im Automatenpreis)',
    'Miete oder Umsatzbeteiligung mit der Schule verhandeln',
    'Startkapital: Woher kommt das Geld? Davon hängt ab, ob die Liquidität reicht',
    'Nutzungsdauer des Automaten (5 Jahre) mit der RW-Lehrkraft abklären',
    'Schultage mit dem Schulkalender NÖ genauer machen'
  ]
};

/* Rechnet den Finanzplan genau wie die Excel-Datei.
   plan: PICKD_FINANZPLAN (oder eine geänderte Kopie) */
window.PICKD_FINANZEN_RECHNEN = function (plan) {
  const summe = arr => arr.reduce((s, x) => s + x, 0);

  // Ø-Werte pro Verkauf, gewichtet ("Sortiment Schule")
  let gewSumme = 0, netto = 0, einkauf = 0;
  plan.sortiment.forEach(s => {
    if (!s.gewicht) return;
    gewSumme += s.gewicht;
    netto += s.preis / (1 + s.ust) * s.gewicht;
    einkauf += s.einkauf * s.gewicht;
  });
  const oNetto = gewSumme ? netto / gewSumme : 0;
  const oEinkauf = gewSumme ? einkauf / gewSumme : 0;
  const oDB = oNetto - oEinkauf;

  // Annahmen
  const schultage = summe(plan.schultage);
  const gruendung = summe(plan.gruendung.map(g => g.betrag));
  const abschreibbar = summe(plan.gruendung.filter(g => g.abschreibbar).map(g => g.betrag));
  const startkosten = summe(plan.gruendung.filter(g => !g.abschreibbar && !g.lager).map(g => g.betrag));
  const abschreibung = plan.nutzungsdauerJahre > 0 ? abschreibbar / plan.nutzungsdauerJahre : 0;
  const fixMonat = summe(plan.fixkosten.map(f => f.betrag));
  const beteiligung = plan.umsatzbeteiligung || 0;

  // "Szenarien Jahr 1"
  const szenarien = plan.szenarien.map(sz => {
    const verkaeufe = sz.verkaeufeProTag * schultage;
    const umsatz = verkaeufe * oNetto;
    const ware = verkaeufe * oEinkauf;
    const db = umsatz - ware;
    const anteilSchule = umsatz * beteiligung;
    const vorAbschreibung = db - anteilSchule - fixMonat * 12 - startkosten;
    return {
      name: sz.name, proTag: sz.verkaeufeProTag, verkaeufe, umsatz, ware, db, anteilSchule,
      fix: fixMonat * 12, startkosten, vorAbschreibung, abschreibung, ergebnis: vorAbschreibung - abschreibung
    };
  });

  // Break-even: nötige Verkäufe pro Schultag (laufend, inkl. Abschreibung, ohne Startkosten)
  const dbNachBeteiligung = oNetto * (1 - beteiligung) - oEinkauf;
  const breakEven = dbNachBeteiligung > 0 && schultage > 0
    ? (fixMonat * 12 + abschreibung) / (dbNachBeteiligung * schultage) : Infinity;

  // "Liquidität Jahr 1" für das gewählte Szenario
  const proTag = plan.szenarien[plan.gewaehltesSzenario].verkaeufeProTag;
  let konto = plan.startkapital || 0;
  const monate = plan.monate.map((m, i) => {
    const verkaeufe = plan.schultage[i] * proTag;
    const ein = verkaeufe * oNetto;
    const aus = {
      gruendung: i === 0 ? gruendung : 0,
      ware: verkaeufe * oEinkauf,
      beteiligung: ein * beteiligung,
      fix: fixMonat
    };
    const anfang = konto;
    konto = anfang + ein - aus.gruendung - aus.ware - aus.beteiligung - aus.fix;
    return { monat: m, schultage: plan.schultage[i], verkaeufe, anfang, ein, aus, ende: konto };
  });
  const tiefststand = Math.min(...monate.map(m => m.ende));

  return {
    oNetto, oEinkauf, oDB, oDBProzent: oNetto ? oDB / oNetto : 0,
    schultage, gruendung, abschreibbar, startkosten, abschreibung, fixMonat, beteiligung,
    szenarien, breakEven, monate, tiefststand, startkapitalNoetig: tiefststand < 0 ? -tiefststand : 0
  };
};
