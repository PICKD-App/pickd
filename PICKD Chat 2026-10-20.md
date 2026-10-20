---
tags: [pickd, website, claude, protokoll]
datum: 2026-10-20
branch: claude/pickd-projekt-bkx4tn
---

# PICKD – Claude-Chat vom 20.10.2026

Gehört zu [[PICKD App]] · Anleitung: [[Anleitung]]

## Kurzfassung
- Kunden-Seite erweitert: **Produktsuche**, **Favoriten**, **„📍 Nächster Automat“ per GPS**
- **App-Icons** aus dem offiziellen PICKD-Logo erstellt + **PWA-Manifest** → beim „Zum Home-Bildschirm“ erscheint das PICKD-Logo statt „P“
- Alles liegt im Branch `claude/pickd-projekt-bkx4tn` auf GitHub – **noch nicht in `main`** (also noch nicht live auf https://pickd-app.github.io/pickd/)

## 1. Neue Funktionen auf der Kunden-Seite
| Funktion | Wie es funktioniert | Dateien |
|---|---|---|
| 🔍 Produktsuche | Suchfeld oben, gilt für Karte und Automaten-Ansicht. Zeigt nur Automaten, die das Produkt **vorrätig** haben. Umlaute egal (ö = oe). Kombinierbar mit Filtern. | `index.html`, `kunde.js`, `style.css` |
| ⭐ Favoriten | Im Produkt-Detail „Als Favorit merken“. Stern auf der Produktkarte, neuer Filter „Favoriten“. Nur im eigenen Browser gespeichert, bleibt bei „Demo zurücksetzen“ erhalten. | `kunde.js`, `store.js` |
| 📍 Nächster Automat | Knopf über der Automatenliste. Nach Standort-Freigabe: Liste nach Entfernung sortiert („Am nächsten · 1,9 km“), nächster passender Automat hervorgehoben, Punkt „Du bist hier“ auf der Karte. | `index.html`, `kunde.js`, `style.css` |

> [!warning] GPS
> Der Standort funktioniert nur über `https://` (GitHub Pages) oder `localhost` – **nicht** beim Öffnen per Doppelklick.

Getestet im Browser (Suche, Entfernungen mit simuliertem Standort, Favoriten, Favoriten-Filter, Betreiber-Seite) – keine Fehler.

## 2. App-Icons & Homescreen (PWA)
**Ausgangslage:** kein Manifest, kein Service Worker, keine PNG-Icons. Einziges Logo im Projekt war `pickd-zeichen.svg` (nur **nachgebaut**).

**Quelle:** offizielles PICKD-Logo (dunkelgrünes Quadrat, limegrünes „P“ mit Blatt) aus Screenshot – „P“ freigestellt, Original-Farbverlauf nachgebildet, Design nicht verändert.

**Neue Dateien in `icons/`:**
- `apple-touch-icon.png` – 180 × 180 (iPhone/iPad)
- `icon-192.png` – 192 × 192 (Android/PWA)
- `icon-512.png` – 512 × 512 (Android/PWA)
- `icon-512-maskable.png` – 512 × 512, „P“ kleiner, damit es beim runden Zuschnitt (Android) vollständig sichtbar bleibt
- `favicon-32.png` – 32 × 32 (Browser-Tab)

**`manifest.webmanifest`:**
- Name: PICKD – Gesunde Snackautomaten · Short Name: PICKD
- `display: standalone`, `start_url` und `scope`: `/pickd/`
- Theme- und Hintergrundfarbe `#172b24` (Dark Green)

**HTML-Head** (`index.html` + `betreiber.html`): Favicon, apple-touch-icon, Manifest, iOS-App-Modus (`apple-mobile-web-app-capable`, Titel „PICKD“, Statusleiste `black`).

**Caching:** Es gibt keinen Service Worker. Icon-Pfade haben `?v=2` → neue Icons werden sicher geladen. Bei späterem Icon-Tausch überall `?v=2` → `?v=3`.

**Geprüft:** Chrome meldet die App als installierbar (keine Fehler), alle Icon-Pfade unter `/pickd/` liefern 200.

> [!note] Noch offen
> Das kleine Logo in der Kopfzeile ist weiterhin die nachgebaute `pickd-zeichen.svg` – kann durch das Original ersetzt werden.

## 3. Neues Logo aufs iPhone holen
Erst möglich, wenn die Änderungen in `main` und damit live sind.
1. Altes PICKD-Symbol lange drücken → „App entfernen“ → „Vom Home-Bildschirm entfernen“
2. Optional: Einstellungen → Safari → „Verlauf und Websitedaten löschen“ (iOS speichert alte Icons hartnäckig)
3. In Safari https://pickd-app.github.io/pickd/ öffnen und laden lassen
4. Teilen (□↑) → „Zum Home-Bildschirm“ → Vorschau zeigt neues Logo → „Hinzufügen“

**Android:** altes Symbol entfernen → Chrome → ⋮ → „App installieren“ / „Zum Startbildschirm hinzufügen“.

## 4. GitHub & Zugriff
- Erster Push schlug fehl (403) → Claude GitHub App für die Organisation **PICKD-App** installiert → danach klappte der Push.
- Commits im Branch `claude/pickd-projekt-bkx4tn`:
  1. Kunden-Seite: Produktsuche, Favoriten und nächster Automat per GPS
  2. App-Icons aus offiziellem PICKD-Logo und PWA-Manifest für Homescreen
  3. Diese Notiz
- **Live schalten:** Pull Request von `claude/pickd-projekt-bkx4tn` nach `main` erstellen und mergen (kann Claude erstellen).

**Änderungen auf den PC holen** (Terminal im Repo-Ordner):
```
git fetch origin
git checkout claude/pickd-projekt-bkx4tn
git pull
```

## 5. Arbeiten zwischen iPad und PC
- Cloud-Sitzungen (claude.ai/code) hängen am Claude-Konto → am PC unter claude.ai/code oder in der Claude-Desktop-App öffnen und weiterschreiben. Im Terminal holt `claude --teleport` eine Cloud-Sitzung lokal.
- Claude in der Cloud kann **nicht direkt** in den Obsidian-Vault auf dem PC schreiben. Weg: Dateien ins Repo → GitHub → `git pull` im Vault. Oder am PC eine lokale Claude-Sitzung im Vault-Ordner starten.
- Der Cloud-Container wird nach Inaktivität gelöscht – nur was auf GitHub gepusht ist, bleibt sicher.

## 6. Nächste Schritte
- [ ] Pull Request nach `main` → Änderungen live
- [ ] Neues Logo am iPhone testen (siehe Abschnitt 3)
- [ ] Logo in der Kopfzeile durch Original ersetzen
- [ ] Angebote
- [ ] Umfrage-Auswertung
- [ ] Nährwerte mit ⚠ prüfen (siehe [[Anleitung]])
