# PICKD – Design-Regeln

Wie PICKD aussieht und warum. Gilt für Kunden-Seite und Betreiber-Bereich.
Produkt, Zielgruppen und Ton stehen in `PRODUCT.md`. Die Werte selbst stehen in `theme.css`:
**Farben, Schrift und Formen nur dort ändern**, nie direkt in `style.css` oder `betreiber.css`.

## Haltung
Beide Oberflächen sind Werkzeuge (Modus „Operate“): Man will in Sekunden wissen, was es gibt, ob es
noch da ist und was es kostet. Deshalb: ruhige helle Flächen, klare Karten, eine starke Markenfarbe
(Dark Green) und ein sparsamer Akzent (Lime). Die Marke zeigt sich in Details (Logo, „D.“ in Lime,
Lime für Ausgewähltes und Angebote), nicht in Effekten.

## Farben (`theme.css`)
| Rolle | Token | Wert | Wofür |
|---|---|---|---|
| Hauptfarbe | `--farbe-primaer` | `#172b24` Dark Green | Kopfzeile, Knöpfe, Pins, Titel, aktiver Tab |
| Hell | `--farbe-primaer-hell` | `#eef4e3` | leise Knöpfe, Bild- und Icon-Flächen |
| Akzent | `--farbe-akzent` | `#c6f46b` Lime | aktiver Filter, Zahl am Pin, „Angebot“, Fokus in der Kopfzeile, heutiger Balken |
| Text auf Lime | `--farbe-akzent-text` | `#172b24` | **immer** Dark Green auf Lime, nie Weiß |
| Hintergrund | `--farbe-hintergrund` | `#f8f9f3` Off White | Seite, Eingabefelder, ausverkauft/gedimmt |
| Karte | `--farbe-karte` | `#ffffff` | Boxen und Karten |
| Text | `--farbe-text` | `#172b24` | Fließtext |
| Text leise | `--farbe-text-leise` | `#6b6b6b` Grey | Zusatzinfos (Kontrast 5:1 auf Off White) |
| Rand | `--farbe-rand` | `#e3e7da` | Ränder, Trennlinien |

**Ampel (Verfügbarkeit):** Punkt/Balken in `--farbe-ok` / `--farbe-fast` / `--farbe-leer`.
Schrift auf den hellen Plaketten in den dunkleren `--farbe-…-text`-Varianten (Kontrast ≥ 4,5:1).
Die Ampel steht **nie allein als Farbe**, immer mit Wort („Verfügbar“, „Fast leer“, „Ausverkauft“).

**Labels:** High Protein (Dark Green), Zuckerfrei (Petrol), Vegan (Grün), Gekühlt (Blau), alle mit weißer
Schrift und Kontrast ≥ 4,5:1. „Angebot“ ist Lime mit Dark-Green-Schrift.

Lime nie als Schriftfarbe auf Weiß oder Off White (kaum lesbar). Das Logo-Zeichen (limegrün) deshalb
nur auf dunklen Flächen; auf hellen Flächen das App-Icon (Zeichen auf dunkelgrünem Quadrat) nehmen.

## Schrift
Manrope (Google Fonts), Ersatz: Segoe UI / System. Grundgröße 15 px.
| Was | Größe / Gewicht |
|---|---|
| Firmenname „PICKD.“ | 22 px, 800, „D.“ in Lime |
| Slogan | 11 px, 400, gesperrt (.32em, auf schmalen Handys .18em) |
| Seitentitel (Automat) | 22 px, 700 |
| Abschnittstitel | 15–18 px, 600–700 |
| Produktname | 14 px, 600 |
| Preis | 16 px, 750, Ziffern gleich breit bei Zahlen in Tabellen |
| Zusatzinfo, Pfand | 11,5–13 px, leise |
| Kennzahlen (Betreiber) | 24 px, 800 |

## Formen & Abstände
- Rundungen: Karten 16 px (`--radius`), kleine Flächen 10 px (`--radius-klein`), Knöpfe, Chips und Plaketten ganz rund.
- Schatten: einer für alles (`--schatten`), sehr weich. Ausverkauft/gedimmt hat keinen Schatten.
- Seitenrand 16 px, Inhalt max. 1200 px breit, Abstände zwischen Karten 10–14 px.

## Bausteine
| Baustein | Regel |
|---|---|
| **Kopfzeile** | Dark Green, Logo-Zeichen + „PICKD.“ + Slogan links, runde Umriss-Knöpfe rechts. Auf dem Handy kürzere Beschriftungen („Kunden“ statt „Kunden-Ansicht“). |
| **Filter-Chips** | Ganz rund, weiß mit Rand; aktiv = Lime. Am Desktop umbrechend, am Handy eine Zeile zum Wischen. |
| **Automaten-Karte** | Typ-Icon links, Name, Typ · Adresse, Ampel-Zeile, Pfeil rechts. Mit Standort: Entfernung fett vorne, nächster Automat mit Lime-Rand. |
| **Produkt-Karte** | Bild/Emoji, Name, Menge, Labels, unten Preis (+ Pfand / alter Preis) und Ampel-Plakette. Ausverkauft: Fläche Off White, Bild grau, Schrift leise, Labels bleiben farbig. |
| **Preis** | Angebot: alter Preis klein durchgestrichen darüber, neuer Preis fett. Pfand klein darunter („+ € 0,25 Pfand“), Preis selbst immer ohne Pfand. |
| **Produkt-Detail** | Dialog, Nährwert-Tabelle pro 100 g/ml und pro Packung, Energie und Eiweiß fett. Ungeprüfte Werte mit ⚠ und „(Richtwert)“. |
| **Knöpfe** | Haupt: Dark Green gefüllt. Leise: Hellgrün mit grüner Schrift. Klein: 13 px. |
| **Karten-Pins** | Tropfen in Dark Green mit weißem Rand, Typ-Emoji, Lime-Zahl = verfügbare (oder passende) Produkte. Gedimmt = grau. |
| **Betreiber-Tabellen** | Seitlich scrollbar auf schmalen Schirmen, Zahlen rechtsbündig, geänderte Felder leicht Lime hinterlegt. |
| **Meldung (Toast)** | Unten mittig, dunkel, 3 Sekunden. |

## Zustände, an die immer gedacht wird
- **Leer:** jede Liste hat einen freundlichen Leer-Hinweis mit einem Vorschlag, was man tun kann.
- **Kein Treffer:** Suche/Filter sagen, warum nichts passt.
- **Karte lädt nicht:** Hinweis statt leerer Fläche; Ersatz-Kartenbilder, wenn OpenStreetMap blockiert.
- **Standort:** „wird bestimmt …“, „nicht freigegeben“ mit Erklärung, „nicht verfügbar“.
- **Fokus (Tastatur):** sichtbarer Ring in Dark Green, in der Kopfzeile in Lime.

## Barrierefreiheit
- Kontrast Text ≥ 4,5:1 (geprüft mit axe-core, 03.11.2026: keine Verstöße auf Kunden-Seite und Betreiber-Bereich, Handy und Desktop).
- Jede Seite hat eine h1 (bei Bedarf nur für Screenreader), Eingaben und Auswahlfelder haben Beschriftungen.
- Emojis sind Schmuck; die Bedeutung steht immer auch als Text daneben.

## Nicht tun
- Keine neuen Farben außerhalb von `theme.css`, keine zweite Schriftart.
- Kein Lime als große Fläche oder als Textfarbe auf Hell.
- Keine Verläufe, Glas-Effekte oder Animationen nur zur Deko.
- Ampel nicht nur über Farbe, Preise nicht mit Pfand vermischen, ⚠ bei Richtwerten nie entfernen.
