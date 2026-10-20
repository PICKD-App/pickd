---
tags: [pickd, website, anleitung]
---

# PICKD Website – Anleitung

Gehört zu [[PICKD App]]. Kunden-Seite: `index.html` · Betreiber-Bereich: `betreiber.html`

## Öffnen
- `index.html` per Doppelklick im Browser öffnen (Internet nötig für Karte & Schrift).
- Betreiber-Bereich: oben rechts auf „Betreiber“. Das Demo-Passwort steht in `config.js`.
- Bestand, Verkäufe und Wünsche werden **simuliert** und im Browser gespeichert. Mit „↺ Demo zurücksetzen“ (Betreiber → Sortiment) geht alles auf Anfang.

## Was ändere ich wo?

| Ich will … | Datei | Was genau |
|---|---|---|
| Farben / Schrift ändern | `theme.css` | Farbwerte bei `--farbe-…`, Schrift bei `--schrift` |
| Logo tauschen | `config.js` | Datei neben die anderen Dateien legen, bei `logo:` den Dateinamen eintragen |
| Name / Slogan ändern | `config.js` | `firmenname`, `slogan` |
| „Fast leer“-Grenze, Fachgröße, Passwort | `config.js` | `fastLeerGrenze`, `kapazitaetProFach`, `demoPasswort` |
| Produkt hinzufügen / Preis / Nährwerte | `data.js` | Block in `PICKD_PRODUKTE` kopieren und anpassen |
| Produktfoto statt Emoji | `data.js` | beim Produkt `bild: 'name.png'` ergänzen |
| Automat / Standort hinzufügen | `data.js` | Block in `PICKD_AUTOMATEN` kopieren, Koordinaten von openstreetmap.org |
| App-Icon (Homescreen) tauschen | `icons/` | Dateien mit gleichem Namen ersetzen, dann in `index.html`, `betreiber.html` und `manifest.webmanifest` überall `?v=2` → `?v=3` |
| Sortiment eines Automaten | `data.js` | Liste `sortiment: [...]` (oder live im Betreiber-Bereich) |

Nach jeder Änderung die Seite im Browser neu laden.

## Als App auf dem Handy
- `manifest.webmanifest` + `icons/` sorgen dafür, dass PICKD nach „Zum Home-Bildschirm“ mit eigenem Icon und ohne Browser-Leiste startet.
- Pfade im Manifest (`/pickd/`) passen zu GitHub Pages unter `https://pickd-app.github.io/pickd/`.

## Aufbau (für später / echte App)
- `store.js` – Datenspeicher & Simulation. Wenn es echte Automaten gibt, wird **nur diese Datei** gegen eine echte Datenbank/Schnittstelle getauscht.
- `kunde.js` – Kunden-Seite (Karte, Automat, Filter, Suche, Favoriten, nächster Automat per GPS, Produktdetails, Wünsche)
- `betreiber.js` – Betreiber-Bereich (Übersicht, Bestand, Statistik, Sortiment)
- `gemeinsam.js` – gemeinsame Bausteine
- `style.css`, `betreiber.css` – Layout

## Offene Punkte
- App-Icons (Homescreen, Favicon) in `icons/` kommen aus dem **offiziellen** PICKD-Logo. Das kleine Logo in der Kopfzeile (`pickd-zeichen.svg`) ist noch **nachgebaut** – Lucas Originaldatei (SVG oder PNG mit transparentem Hintergrund) einsetzen.
- Nährwerte mit ⚠ sind Richt-/Schätzwerte (`geprueft: false` in `data.js`): Trockenfrüchte-Mix, Rice Up, Soletti, Coca-Cola Zero, Red Bull, Risbellis, Skyr Heidelbeere, Sandwich.
- „Red Bull Sugarfree Cherry“ aus der Produkttabelle als normales „Red Bull Sugarfree“ eingetragen.
- ✅ Erledigt: Produktsuche, Favoriten (⭐ im Produkt-Detail, Filter „Favoriten“) und „📍 Nächster Automat“ per GPS.
  - Der Standort funktioniert nur über `https://` (z.B. GitHub Pages) oder `localhost`, nicht beim Öffnen per Doppelklick.
  - Favoriten werden nur im jeweiligen Browser gespeichert.
- Nebenfunktionen kommen später (Angebote, Umfrage-Auswertung …).
