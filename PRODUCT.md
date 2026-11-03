# PICKD – Produktkontext

Dauerhafte Grundlage für jede Design- und Code-Arbeit an PICKD. Erst lesen, dann gestalten.
Farben, Schrift und Formen stehen technisch in `theme.css`, Einstellungen in `config.js`.

## Was PICKD ist
PICKD ist ein Schulprojekt der HAK St. Pölten (Klasse 3IK, Schuljahr 2026/27): eine geplante Firma
(PICKD GmbH) mit Snack- und Getränkeautomaten, die ein **gesundes Sortiment** haben (High Protein,
zuckerfrei, vegan). Das Sortiment ist **je Standort angepasst** (Schule, Gym, Bahnhof, Einkaufszentrum).

**Problem, das PICKD löst (Businessplan):** Viele Snackautomaten haben ein einheitliches, oft ungesundes
Sortiment. PICKD passt das Angebot an Standort und Zielgruppe an. PICKD verdient am Verkauf der Produkte,
stellt die Automaten selbst auf, befüllt und betreut sie. Start mit einem Testautomaten in Niederösterreich,
danach Ausbau in ganz Österreich.

Diese Web-App zeigt, was in welchem Automaten gerade verfügbar ist. Es gibt noch keine echten Automaten:
Bestand, Verkäufe und Wünsche werden simuliert (`store.js`). Die App muss trotzdem wie ein echtes
Produkt wirken, denn sie wird im Schulwettbewerb gezeigt.

## Für wen
| Gruppe | Situation | Was sie braucht |
|---|---|---|
| Schüler:innen und Studierende (HAK, HTL) | Pause, Handy in der Hand, wenig Zeit | Schnell sehen: Was gibt es, ist es noch da, was kostet es |
| Berufstätige (Unternehmen) | Arbeitspause | Laut Businessplan Zielgruppe, in der App gibt es aber noch keinen Unternehmens-Standort |
| Gym-Besucher:innen | vor/nach dem Training | Protein-Produkte und gekühlte Getränke finden |
| Pendler:innen (Bahnhof) | unterwegs, Eile | Nächster Automat, Verfügbarkeit, Route |
| Einkaufszentrum | spontan | Überblick, Preis, Nährwerte |
| Betreiber (Team PICKD) | am Laptop | Bestand, Nachfüllbedarf, Verkaufszahlen, Sortiment und Preise |

## Oberflächen und ihr Modus
| Oberfläche | Datei | Modus | Heißt konkret |
|---|---|---|---|
| Kunden-Seite (Karte, Automat, Produkt-Detail, Wünsche) | `index.html`, `kunde.js` | **Operate** | Mobil zuerst, mit einer Hand bedienbar, in Sekunden erfassbar. Marke zeigt sich in Details, nicht in Effekten. |
| Betreiber-Bereich (Übersicht, Bestand, Statistik, Sortiment) | `betreiber.html`, `betreiber.js` | **Operate** | Am Laptop, Daten schnell scannbar, klare Zahlen, Nachfüllbedarf sofort sichtbar. |
| Eventuell später: Landingpage für den Wettbewerb | – | Persuade | Noch nicht geplant. |

## Marke (aus Lucas Logo-Board, verbindlich)
- **Name:** PICKD, Schriftzug „PICKD.“ mit „D.“ in Lime
- **Slogan:** „pick what fits.“ (klein geschrieben)
- **Zeichen:** „P“ mit Blatt, limegrün auf Dark Green. Offizielle Version in `icons/` (App-Icons);
  `pickd-zeichen.svg` in der Kopfzeile ist nur nachgebaut und soll durch Lucas Originaldatei ersetzt werden.
- **Farben:** Dark Green `#172B24` (Hauptfarbe), Lime `#C6F46B` (Akzent), Off White `#F8F9F3`
  (Hintergrund), Grey `#6B6B6B` (Sekundär)
- **Schrift:** Manrope, Bold für Titel, Regular für Text
- Lime ist **Akzent**, keine Flächenfarbe für Text: auf Lime steht immer Dark Green.

## Wodurch PICKD sich abhebt (Businessplan, Konkurrenzvergleich)
Konkurrenz: Selecta, Easy Vending, café+co, boxed., DGA Vending. Das sind große, allgemeine Automatenanbieter.
PICKD soll sich davon unterscheiden durch:
- gesundes Sortiment (Protein, zuckerfrei, vegan)
- **eigene App** mit Standorten, Preisen, Nährwerten und Verfügbarkeit
- Sortiment je Standort
- smarte Bestandskontrolle (rechtzeitig nachfüllen)
- faire Preise und Angebote für Schüler, Studierende und Sportler

Für das Design heißt das: PICKD soll **nicht** wie ein klassischer Verkaufsautomaten-Anbieter wirken
(nüchtern, Firmenkunden-Optik), sondern wie eine junge, moderne App. Die App selbst ist ein Verkaufsargument.

## Sprache und Ton
- Deutsch (Österreich), Du-Form, locker und kurz: „Was fehlt dir hier?“, „Will ich auch“
- Klare Wörter statt Fachbegriffe: „Fast leer“, „Ausverkauft“, „Route“
- Keine übertriebenen Gesundheitsversprechen. Labels kommen aus den Nährwerten (EU-Regeln in `config.js`), nicht aus Werbetexten.

## Produktwahrheiten, die das Design nicht verfälschen darf
- **Nährwerte:** pro 100 g/ml und pro Packung. Werte mit `geprueft: false` sind Richtwerte und werden mit ⚠ gekennzeichnet. Diese Kennzeichnung bleibt sichtbar.
- **Labels** „High Protein“ und „Zuckerfrei“ werden berechnet, „Vegan“ und „Gekühlt“ kommen aus `data.js`.
- **Verfügbarkeit** als Ampel: Verfügbar / Fast leer (weniger als 5 Stück) / Ausverkauft. Farbe nie allein, immer mit Text.
- **Demo-Hinweis** im Fuß bleibt, solange die Daten simuliert sind.
- **Preise** kommen aus der Produkttabelle (Luis Till) und sind dort **ohne Pfand (0,25 €)** angegeben. Die App zeigt den Pfand derzeit nirgends an.

## Technische Grenzen
- Reines HTML/CSS/JS, **kein Build-Schritt**, keine Frameworks. Karte: Leaflet + OpenStreetMap.
- Veröffentlicht über **GitHub Pages** unter `https://pickd-app.github.io/pickd/` (Repo `PICKD-App/pickd`, Branch `main`). Alle Pfade relativ, `start_url` und `scope` im Manifest sind `/pickd/`.
- Dateien liegen flach in einem Ordner, einzige Ausnahme ist `icons/` (GitHub-Web-Upload hat früher Ordner verloren).
- Als App zum Homescreen hinzufügbar (`manifest.webmanifest`, kein Service Worker). Icon-Pfade haben `?v=2`; beim Tausch hochzählen.
- `store.js` ist die einzige Datenschicht und soll später gegen echte Automaten-Daten getauscht werden. Eine echte Handy-App ist später möglich, deshalb Logik und Darstellung getrennt halten.
- Plattform: **Web** (mobil zuerst, funktioniert auch am Desktop).

## Funktionsumfang
Fertig: Karte mit allen Automaten, Automaten-Ansicht, Produkt-Detail mit Nährwerten, Filter (High Protein,
Zuckerfrei, Vegan, Gekühlt), Produktwünsche mit Likes, Produktsuche, Favoriten, nächster Automat per GPS,
Betreiber-Login (Demo-Passwort), Übersicht, Bestand/Nachfüll-Liste, Statistik, Sortiment & Preise.

Später: Angebote, Umfrage-Auswertung. Idee aus Lucas Mockup: Handy-App mit unterer Navigation
(Home, Karte, Sortiment, Wunschliste, Profil).

## Was die Umfrage misst (Tobias Mitterbauer)
10 Fragen, mind. 30 Personen. Für die App relevant: Würden sie eine PICKD-App nutzen (Frage 8), wie wichtig
sind Nährwertangaben (Frage 9) und Proteingehalt (Frage 6), welche Preise sind okay (Frage 5: unter 2 € bis über 4 €).
**Ergebnisse gibt es noch keine** (Stand 03.11.). Sobald sie da sind, gehören sie hier hinein, weil sie Design-Entscheidungen begründen.

## Automaten (Fabian Pendl)
Verglichen: boxed. Snackautomat basic (ab 4.740 €), TecMaschin VA-6K (3.731 €), Zitzmann AZ500 (6.499 €).
Nur der AZ500 bietet laut Anbieter Live-Bestandsüberwachung und digitale Fernüberwachung. Davon hängt ab,
ob `store.js` später echte Bestandsdaten bekommen kann.

## Team
Design & Marketing: Luca Schmalek. App: Luis Till hilft Luca. Weitere Aufgaben (Markt, Technik, Umfrage,
Finanzen) liegen bei Tobias Peham, Fabian Pendl, Tobias Mitterbauer und Dominik Sparer.

## Offene Fragen
- Gibt es Apps oder Stile, an denen sich PICKD **visuell** orientieren soll? (Abgrenzung zur Konkurrenz steht oben.)
- Soll der Pfand (0,25 €) bei Getränken in der App angezeigt werden?
- Soll die untere Navigation aus Lucas Mockup in die Web-App übernommen werden?
- Wann liefert Luca die Logo-Originaldatei (SVG oder PNG mit transparentem Hintergrund)? Vorhanden ist bisher
  nur ein Bild der kompletten Wortmarke (Zeichen oben, „PICKD.“ in Weiß mit „D.“ in Lime, darunter
  „pick what fits.“, auf Dark Green) in niedriger Auflösung. Für die Kopfzeile reicht das nicht scharf.
