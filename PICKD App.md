---
tags: [projekt, schule, app, pickd]
status: in-arbeit
---

# PICKD App

Schulprojekt/Wettbewerb (HAK St. Pölten, Schuljahr 2026/27, Fach/Ordner „IBTPMCS“, Klasse 3IK). Unterlagen: `C:\Users\luist\OneDrive - HAK St. Pölten\2026_27\IBTPMCS` (Businessplan, Produkttabelle, Umfrage). Regel: siehe [[PICKD Quellen und Speicherort]] (OneDrive nur lesen, alles lokal in Obsidian speichern).

**Geschäftsidee:** PICKD GmbH — Snack-/Getränkeautomaten mit gesundem Sortiment (Protein, zuckerfrei, vegan), Sortiment je Standort angepasst (Schule, Gym, Unternehmen, Bahnhof). Start mit Testautomat in Niederösterreich.

**App-Funktionen laut Businessplan:**
- Karte mit allen Automaten
- Aktuelles Sortiment je Automat, Preise, Nährwerte, Verfügbarkeit
- Filter: High Protein, Zuckerfrei, Vegan
- Produktwünsche je Automat
- (Betreiberseite) Verkaufs-/Bestandsdaten → Beliebtheit, Nachfüllbedarf

**Datenbasis:** Produkttabelle mit 19 Produkten (z.B. Rawbite, MORE Protein Riegel, Vöslauer, Coke Zero, Skyr) inkl. Einkauf/Verkauf/Marge; Ø Verkaufspreis ~1,91 €.

**Festgelegte Entscheidungen (2026-10-17):**
- Standorte (5 Automaten, alle St. Pölten): HAK St. Pölten, HTL St. Pölten, Speedfit St. Pölten, Hauptbahnhof St. Pölten, EKZ Süd St. Pölten
- „Fast leer“ = weniger als 5 Stück eines Produkts im Automaten
- Plattform: zuerst Web-App; später eventuell echte Handy-App → Architektur so wählen, dass ein späterer Umstieg leicht ist
- Betreiber-Bereich: einfacher Demo-Login mit fixem Passwort
- Keine fixe Deadline; Fokus zuerst auf Hauptfunktionen, Nebenfunktionen werden danach schrittweise ergänzt/angepasst
- Automaten-/Verkaufsdaten werden simuliert (noch keine echten Automaten)

**Team & Aufgaben (Stand 2026-10-17):**
1. Markt-/Konkurrenzanalyse – Tobias Peham (offen; eine Konkurrenztabelle steht aber schon im Businessplan)
2. Automaten & Technik – Fabian Pendl (offen): 3 Automaten, Preis, Kühlung, Kartenzahlung, Bestandsüberwachung/App-Anbindung
3. Sortiment & Lieferanten – Luis Till (erledigt → Produkttabelle)
4. Zielgruppen & Umfrage – Tobias Mitterbauer (laut Luis erledigt; im Ordner lagen am 17.10. aber nur Fragen, noch keine Ergebnisse)
5. Finanzen – Dominik Sparer (offen)
6. App, Marketing & Design – Luca Schmalek (offen): Logo, Design, App-Skizze, Marketing. **Luis hilft Luca bei der App** — dafür ist diese Zusammenarbeit mit Claude.

**Design (Lucas Logo-Board, 17.10. im Chat geschickt, nicht im OneDrive):** Dark Green `#172B24` (Haupt), Lime `#C6F46B` (Akzent), Off White `#F8F9F3` (Hintergrund), Grey `#6B6B6B` (Sekundär). Schrift Manrope (Bold/Regular). Schriftzug „PICKD.“ mit „D.“ in Lime, Slogan „pick what fits.“. Zeichen = „P“ mit Blatt. Das Mockup zeigt eine Handy-App mit unterer Navigation (Home, Karte, Sortiment, Wunschliste, Profil) → Idee für später.

**Umsetzung:** Website in [[Anleitung|PICKD App/Website]] (plain HTML/CSS/JS, kein Build, Leaflet + OpenStreetMap). Hauptfunktionen fertig (17.10.): Karte, Automaten-Ansicht, Produktdetails mit Nährwerten, Filter, Produktwünsche, Betreiber-Login, Übersicht, Bestand/Nachfüll-Liste, Statistik, Sortiment & Preise. Design zentral in `css/theme.css`, Einstellungen in `js/config.js`, Daten in `js/data.js`, Simulation in `js/store.js` (später gegen echte Daten tauschbar).
- Koordinaten (OSM): HAK 48.20731/15.61943, HTL Waldstraße 3, Speedfit Nord Dr.-Doch-Gasse 3 (3107), Hbf Bahnhofplatz 1, EKZ Süd Rödlgasse (Spratzern)
- Logo-Zeichen ist nur nachgebaut → Originaldatei von Luca fehlt noch
- 8 Produkte haben nur Richtwerte bei den Nährwerten (`geprueft: false`)
- Zum Testen: Node-Server per `.obsidian/.claude/launch.json` (Port 8080), Skript `PICKD App/Werkzeuge/testserver.js` (Node unter `C:\Users\luist\Claude\node\node.exe`; Python ist nicht installiert)

**Veröffentlichen:** Luis hat sich für GitHub Pages entschieden (statt Netlify). Auf dem PC sind weder `git` noch `gh` installiert → Upload über die GitHub-Weboberfläche (Inhalt von `Website` ins Repo-Hauptverzeichnis, Pages: Branch `main`, Ordner `/ (root)`). Konto/Login macht Luis selbst.

Stand 2026-10-17: Hauptfunktionen + Lucas Design umgesetzt; Nebenfunktionen offen; GitHub-Veröffentlichung in Arbeit.
