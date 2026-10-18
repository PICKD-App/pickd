/* =========================================================
   PICKD – Einstellungen
   Hier stehen alle Werte, die man ohne Programmierkenntnisse
   ändern kann. Nach dem Speichern einfach die Seite neu laden.
   ========================================================= */
window.PICKD_CONFIG = {
  // Name & Logo (Logo-Datei liegt im Ordner "assets")
  firmenname: 'PICKD',
  slogan: 'pick what fits.',
  // Markenzeichen (nachgebaut nach Lucas Logo-Board). Originaldatei einfach
  // in den Ordner "assets" legen und hier den Dateinamen eintragen.
  logo: 'assets/pickd-zeichen.svg',
  // Schriftzug "PICKD." neben dem Zeichen anzeigen (false, wenn das Logo ihn schon enthält)
  nameNebenLogo: true,

  // Ab wie vielen Stück ein Produkt als "fast leer" gilt (weniger als dieser Wert)
  fastLeerGrenze: 5,

  // Wie viele Stück pro Produkt maximal in einen Automaten passen
  kapazitaetProFach: 12,

  // Passwort für den Betreiber-Bereich (nur Demo, kein echter Schutz!)
  demoPasswort: 'pickd2026',

  // Startausschnitt der Karte (Mitte von St. Pölten)
  karte: {
    zentrum: [48.2035, 15.628], zoom: 13,
    // Kartenbilder (kostenlos, ohne Schlüssel)
    kacheln: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    quelle: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende',
    // Ersatz, falls die Kartenbilder oben nicht laden
    ersatzKacheln: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    ersatzQuelle: 'Kartenbilder &copy; Esri'
  },

  // Ab wann ein Produkt automatisch die Labels bekommt:
  // High Protein = mind. 20 % der Kalorien aus Eiweiß (EU-Regel)
  highProteinAnteil: 0.20,
  // Zuckerfrei = höchstens 0,5 g Zucker pro 100 g/ml (EU-Regel)
  zuckerfreiMax: 0.5,

  // Wie viele Tage Verkaufsdaten simuliert werden
  simulationTage: 14
};
