---
tags: [pickd, website, anleitung]
---

# PICKD Website – Anleitung

Gehört zu [[PICKD App]]. Kunden-Seite: `index.html` · Betreiber-Bereich: `betreiber.html`

## Öffnen
- `index.html` per Doppelklick im Browser öffnen (Internet nötig für Karte & Schrift).
- Betreiber-Bereich: oben rechts auf „Betreiber“. Das Demo-Passwort steht in `js/config.js`.
- Bestand, Verkäufe und Wünsche werden **simuliert** und im Browser gespeichert. Mit „↺ Demo zurücksetzen“ (Betreiber → Sortiment) geht alles auf Anfang.

## Was ändere ich wo?

| Ich will … | Datei | Was genau |
|---|---|---|
| Farben / Schrift ändern | `css/theme.css` | Farbwerte bei `--farbe-…`, Schrift bei `--schrift` |
| Logo tauschen | `assets/` + `js/config.js` | Datei in `assets` legen, bei `logo:` den Dateinamen eintragen |
| Name / Slogan ändern | `js/config.js` | `firmenname`, `slogan` |
| „Fast leer“-Grenze, Fachgröße, Passwort | `js/config.js` | `fastLeerGrenze`, `kapazitaetProFach`, `demoPasswort` |
| Produkt hinzufügen / Preis / Nährwerte | `js/data.js` | Block in `PICKD_PRODUKTE` kopieren und anpassen |
| Produktfoto statt Emoji | `js/data.js` | beim Produkt `bild: 'assets/fotos/name.png'` ergänzen |
| Automat / Standort hinzufügen | `js/data.js` | Block in `PICKD_AUTOMATEN` kopieren, Koordinaten von openstreetmap.org |
| Sortiment eines Automaten | `js/data.js` | Liste `sortiment: [...]` (oder live im Betreiber-Bereich) |

Nach jeder Änderung die Seite im Browser neu laden.

## Aufbau (für später / echte App)
- `js/store.js` – Datenspeicher & Simulation. Wenn es echte Automaten gibt, wird **nur diese Datei** gegen eine echte Datenbank/Schnittstelle getauscht.
- `js/kunde.js` – Kunden-Seite (Karte, Automat, Filter, Produktdetails, Wünsche)
- `js/betreiber.js` – Betreiber-Bereich (Übersicht, Bestand, Statistik, Sortiment)
- `js/gemeinsam.js` – gemeinsame Bausteine
- `css/style.css`, `css/betreiber.css` – Layout

## Offene Punkte
- Logo-Zeichen ist **nachgebaut** – Lucas Originaldatei (SVG oder PNG mit transparentem Hintergrund) einsetzen.
- Nährwerte mit ⚠ sind Richt-/Schätzwerte (`geprueft: false` in `data.js`): Trockenfrüchte-Mix, Rice Up, Soletti, Coca-Cola Zero, Red Bull, Risbellis, Skyr Heidelbeere, Sandwich.
- „Red Bull Sugarfree Cherry“ aus der Produkttabelle als normales „Red Bull Sugarfree“ eingetragen.
- Nebenfunktionen kommen später (Suche, Favoriten, nächster Automat per GPS, Angebote, Umfrage-Auswertung …).
