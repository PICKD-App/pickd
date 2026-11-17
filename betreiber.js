/* =========================================================
   PICKD – Betreiber-Bereich
   Login · Übersicht · Bestand & Nachfüllen · Statistik · Sortiment · Finanzen
   ========================================================= */
(function () {
  const S = window.PICKD;
  const LOGIN_KEY = 'pickd-betreiber-angemeldet';
  const TAG = 864e5;
  let aktuellerTab = 'uebersicht';
  let statistikTage = 7;

  S.kopfEinrichten();

  /* ---------- Login (nur Demo!) ---------- */
  function angemeldet() {
    try { return sessionStorage.getItem(LOGIN_KEY) === '1'; } catch (e) { return window.__pickdLogin === true; }
  }
  function setzeAngemeldet(wert) {
    try { wert ? sessionStorage.setItem(LOGIN_KEY, '1') : sessionStorage.removeItem(LOGIN_KEY); } catch (e) { }
    window.__pickdLogin = wert;
  }
  function ansichtWaehlen() {
    const drin = angemeldet();
    document.getElementById('login-ansicht').classList.toggle('versteckt', drin);
    document.getElementById('app-ansicht').classList.toggle('versteckt', !drin);
    document.getElementById('abmelden').classList.toggle('versteckt', !drin);
    if (drin) zeichnen(); else document.getElementById('passwort').focus();
  }
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const feld = document.getElementById('passwort');
    if (feld.value === S.config.demoPasswort) {
      setzeAngemeldet(true); feld.value = '';
      document.getElementById('login-fehler').classList.add('versteckt');
      ansichtWaehlen();
    } else {
      document.getElementById('login-fehler').classList.remove('versteckt');
      feld.select();
    }
  });
  document.getElementById('abmelden').addEventListener('click', () => { setzeAngemeldet(false); ansichtWaehlen(); });

  /* ---------- Hilfen ---------- */
  function heuteStart() { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
  function kennzahlen(verkaeufe) {
    let umsatz = 0, gewinn = 0;
    verkaeufe.forEach(v => { const p = S.produkt(v[2]); umsatz += p.preis || 0; gewinn += S.gewinnProStueck(p) || 0; });
    return { stueck: verkaeufe.length, umsatz, gewinn };
  }
  function bestandsInfo(automatId) {
    const kap = S.config.kapazitaetProFach;
    const z = { ok: 0, fast: 0, leer: 0, stueck: 0, max: 0 };
    S.sortiment(automatId).forEach(id => {
      const n = S.bestand(automatId, id);
      z[S.status(n)]++; z.stueck += n; z.max += kap;
    });
    z.prozent = z.max ? Math.round(z.stueck / z.max * 100) : 0;
    return z;
  }
  function fuellBalken(prozent, status) {
    return `<div class="fuell" title="${prozent} %"><i class="${status}" style="width:${Math.max(prozent, 2)}%"></i></div>`;
  }
  let toastTimer;
  function meldung(text) {
    const t = document.getElementById('toast');
    t.textContent = text; t.classList.remove('versteckt');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.add('versteckt'), 3000);
  }

  /* ---------- Tabs ---------- */
  document.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', () => {
    aktuellerTab = btn.dataset.tab; zeichnen(); window.scrollTo(0, 0);
  }));

  function zeichnen() {
    if (!angemeldet()) return;
    document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === aktuellerTab));
    const ziel = document.getElementById('tab-inhalt');
    ({ uebersicht: uebersicht, bestand: bestand, statistik: statistik, sortiment: sortiment, finanzen: finanzen })[aktuellerTab](ziel);
  }
  window.addEventListener('pickd-update', zeichnen);

  /* ========== 1. Übersicht ========== */
  function uebersicht(ziel) {
    const heute = kennzahlen(S.verkaeufe(heuteStart()));
    const gestern = kennzahlen(S.verkaeufe(heuteStart() - TAG, heuteStart()));
    let warnFast = 0, warnLeer = 0;
    S.alleAutomaten().forEach(a => { const b = bestandsInfo(a.id); warnFast += b.fast; warnLeer += b.leer; });
    const top = S.wuensche().slice(0, 5);

    ziel.innerHTML = `
      <div class="kpis">
        <div class="box kpi"><div class="titel">Umsatz heute</div><div class="wert">${S.euro(heute.umsatz)}</div><div class="unter">gestern ${S.euro(gestern.umsatz)}</div></div>
        <div class="box kpi"><div class="titel">Verkäufe heute</div><div class="wert">${heute.stueck}</div><div class="unter">gestern ${gestern.stueck}</div></div>
        <div class="box kpi"><div class="titel">Gewinn heute (netto)</div><div class="wert">${S.euro(heute.gewinn)}</div><div class="unter">nach Einkauf & USt</div></div>
        <div class="box kpi ${warnLeer ? 'warnung' : ''}"><div class="titel">Nachfüllbedarf</div><div class="wert">${warnFast + warnLeer}</div><div class="unter">${warnLeer} leer · ${warnFast} fast leer</div></div>
      </div>

      <div class="box abschnitt">
        <div class="abschnitt-kopf"><h2>Automaten</h2>
          <button class="knopf leise klein" id="simulieren" title="Für die Präsentation: ein zufälliger Kauf passiert">🎲 Verkauf simulieren</button></div>
        <div class="tabelle-huelle" tabindex="0" role="region" aria-label="Tabelle, seitlich scrollbar"><table class="tabelle">
          <thead><tr><th>Standort</th><th class="zahl">Verkäufe heute</th><th class="zahl">Umsatz heute</th><th>Füllstand</th><th>Warnungen</th></tr></thead>
          <tbody>${S.alleAutomaten().map(a => {
            const k = kennzahlen(S.verkaeufe(heuteStart(), null, a.id));
            const b = bestandsInfo(a.id);
            const st = b.leer ? 'leer' : b.fast ? 'fast' : 'ok';
            return `<tr><td>${S.typen[a.typ].emoji} ${S.esc(a.name)}</td><td class="zahl">${k.stueck}</td><td class="zahl">${S.euro(k.umsatz)}</td>
              <td><div style="display:flex;gap:8px;align-items:center">${fuellBalken(b.prozent, st)}<span class="klein leise">${b.prozent}%</span></div></td>
              <td>${b.leer ? `<span class="status leer">${b.leer} leer</span> ` : ''}${b.fast ? `<span class="status fast">${b.fast} fast leer</span>` : ''}${!b.leer && !b.fast ? '<span class="status ok">alles ok</span>' : ''}</td></tr>`;
          }).join('')}</tbody>
        </table></div>
      </div>

      <div class="box abschnitt">
        <div class="abschnitt-kopf"><h2>💡 Top-Produktwünsche der Kunden</h2></div>
        ${top.length ? `<div class="hbalken">${top.map(w => `
          <div class="zeile"><span class="name" title="${S.esc(w.text)}">${S.esc(w.text)} <span class="leise klein">· ${S.esc((S.automat(w.automat) || { name: 'unbekannt' }).name)}</span></span>
          <div class="spur"><i style="width:${w.likes / top[0].likes * 100}%"></i></div><span class="zahl">${w.likes} 👍</span></div>`).join('')}</div>`
          : '<p class="leise">Noch keine Wünsche.</p>'}
      </div>`;

    document.getElementById('simulieren').addEventListener('click', () => {
      const v = S.verkaufSimulieren();
      if (v) meldung(`Verkauft: ${v.produkt.name} in ${v.automat.name}`);
    });
  }

  /* ========== 2. Bestand & Nachfüllen ========== */
  function bestand(ziel) {
    const kap = S.config.kapazitaetProFach;
    // Packliste: was muss ins Auto, um alle fast leeren/leeren Fächer voll zu machen?
    const pack = {};
    S.alleAutomaten().forEach(a => S.sortiment(a.id).forEach(id => {
      const n = S.bestand(a.id, id);
      if (S.status(n) !== 'ok') pack[id] = (pack[id] || 0) + (kap - n);
    }));
    const packListe = Object.entries(pack).sort((x, y) => y[1] - x[1]);

    ziel.innerHTML = `
      <div class="box abschnitt">
        <div class="abschnitt-kopf"><h2>🚚 Nachfüll-Liste</h2>
          <button class="knopf klein" id="alle-fuellen" ${packListe.length ? '' : 'disabled'}>Alle Automaten auffüllen</button></div>
        <p class="leise klein" style="margin-top:-6px">Alle Produkte unter ${S.config.fastLeerGrenze} Stück werden auf ${kap} Stück aufgefüllt.</p>
        ${packListe.length ? `<ul class="packliste">${packListe.map(([id, n]) => {
          const p = S.produkt(id);
          return `<li><span>${p.emoji} ${S.esc(p.name)}</span><strong>${n} Stück</strong></li>`;
        }).join('')}</ul>` : '<p class="leise">Alles voll – nichts zu tun. 🎉</p>'}
      </div>
      ${S.alleAutomaten().map(a => {
        const b = bestandsInfo(a.id);
        const zeilen = S.sortiment(a.id).map(id => ({ p: S.produkt(id), n: S.bestand(a.id, id) }))
          .sort((x, y) => x.n - y.n);
        return `<div class="box abschnitt">
          <div class="abschnitt-kopf"><h2>${S.typen[a.typ].emoji} ${S.esc(a.name)}</h2>
            <div style="display:flex;gap:8px;align-items:center"><span class="klein leise">${b.prozent}% voll</span>
            <button class="knopf leise klein" data-fuellen="${a.id}" ${b.fast || b.leer || b.prozent < 100 ? '' : 'disabled'}>Nachfüllen</button></div></div>
          ${zeilen.map(({ p, n }) => `<div class="bestand-zeile"><span>${p.emoji}</span><span>${S.esc(p.name)}</span>
            ${fuellBalken(Math.round(n / kap * 100), S.status(n))}<span class="anz">${n}/${kap}</span>${S.statusHtml(n)}</div>`).join('')}
        </div>`;
      }).join('')}`;

    document.getElementById('alle-fuellen').addEventListener('click', () => { S.allesNachfuellen(); meldung('Alle Automaten aufgefüllt ✔'); });
    ziel.querySelectorAll('[data-fuellen]').forEach(btn => btn.addEventListener('click', () => {
      S.nachfuellen(btn.dataset.fuellen); meldung(S.automat(btn.dataset.fuellen).name + ' aufgefüllt ✔');
    }));
  }

  /* ========== 3. Statistik ========== */
  function statistik(ziel) {
    const start = heuteStart() - (statistikTage - 1) * TAG;
    const alle = S.verkaeufe(start);
    const gesamt = kennzahlen(alle);

    // Umsatz pro Tag
    const tage = [];
    for (let i = 0; i < statistikTage; i++) {
      const von = start + i * TAG;
      const k = kennzahlen(alle.filter(v => v[0] >= von && v[0] < von + TAG));
      const d = new Date(von);
      tage.push({ d, umsatz: k.umsatz });
    }
    const maxTag = Math.max(...tage.map(t => t.umsatz), 1);

    // Umsatz pro Automat
    const proAutomat = S.alleAutomaten().map(a => ({ a, k: kennzahlen(alle.filter(v => v[1] === a.id)) }))
      .sort((x, y) => y.k.umsatz - x.k.umsatz);
    const maxAutomat = Math.max(...proAutomat.map(x => x.k.umsatz), 1);

    // Top-Produkte
    const zaehler = {};
    alle.forEach(v => { zaehler[v[2]] = (zaehler[v[2]] || 0) + 1; });
    const topProdukte = Object.entries(zaehler).sort((x, y) => y[1] - x[1]).slice(0, 10);
    const maxProdukt = topProdukte.length ? topProdukte[0][1] : 1;

    // Verkäufe nach Uhrzeit
    const stunden = Array(24).fill(0);
    alle.forEach(v => { stunden[new Date(v[0]).getHours()]++; });
    const von = 5, bis = 23;
    const maxStunde = Math.max(...stunden.slice(von, bis), 1);

    const wochentag = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    ziel.innerHTML = `
      <div class="abschnitt-kopf" style="margin-bottom:12px">
        <h2 style="font-size:17px">Auswertung</h2>
        <select class="auswahl" id="zeitraum" aria-label="Zeitraum">
          <option value="7" ${statistikTage === 7 ? 'selected' : ''}>Letzte 7 Tage</option>
          <option value="14" ${statistikTage === 14 ? 'selected' : ''}>Letzte 14 Tage</option>
        </select>
      </div>
      <div class="kpis">
        <div class="box kpi"><div class="titel">Umsatz</div><div class="wert">${S.euro(gesamt.umsatz)}</div></div>
        <div class="box kpi"><div class="titel">Verkäufe</div><div class="wert">${gesamt.stueck}</div></div>
        <div class="box kpi"><div class="titel">Gewinn (netto)</div><div class="wert">${S.euro(gesamt.gewinn)}</div></div>
        <div class="box kpi"><div class="titel">Ø pro Verkauf</div><div class="wert">${S.euro(gesamt.stueck ? gesamt.umsatz / gesamt.stueck : 0)}</div></div>
      </div>

      <div class="box abschnitt">
        <h2>Umsatz pro Tag</h2>
        <div class="saeulen">${tage.map((t, i) => {
          const we = t.d.getDay() === 0 || t.d.getDay() === 6;
          const heute = i === tage.length - 1;
          return `<div class="saeule" title="${t.d.toLocaleDateString('de-AT')}: ${S.euro(t.umsatz)}">
            <span class="wert">${Math.round(t.umsatz)}€</span>
            <div class="balken ${heute ? 'heute' : we ? 'wochenende' : ''}" style="height:${t.umsatz / maxTag * 100}%"></div>
            <span class="beschr">${heute ? 'Heute' : wochentag[t.d.getDay()] + (statistikTage > 7 ? '' : ' ' + t.d.getDate() + '.')}</span></div>`;
        }).join('')}</div>
        <p class="leise klein">Hellere Balken = Wochenende (Schulen haben dann zu). Heute zählt nur bis jetzt.</p>
      </div>

      <div class="zwei-spalten">
        <div class="box abschnitt">
          <h2 style="margin-bottom:12px">Umsatz pro Automat</h2>
          <div class="hbalken">${proAutomat.map(({ a, k }) => `
            <div class="zeile"><span class="name">${S.typen[a.typ].emoji} ${S.esc(a.name)}</span>
            <div class="spur"><i style="width:${k.umsatz / maxAutomat * 100}%"></i></div><span class="zahl">${S.euro(k.umsatz)}</span></div>`).join('')}
          </div>
        </div>
        <div class="box abschnitt">
          <h2 style="margin-bottom:12px">Top 10 Produkte</h2>
          <div class="hbalken">${topProdukte.map(([id, n]) => {
            const p = S.produkt(id);
            return `<div class="zeile"><span class="name" title="${S.esc(p.name)}">${p.emoji} ${S.esc(p.name)}</span>
              <div class="spur"><i style="width:${n / maxProdukt * 100}%"></i></div><span class="zahl">${n} Stk</span></div>`;
          }).join('')}</div>
        </div>
      </div>

      <div class="box abschnitt">
        <h2>Verkäufe nach Uhrzeit</h2>
        <div class="saeulen" style="height:140px">${stunden.slice(von, bis).map((n, i) => `
          <div class="saeule" title="${von + i}–${von + i + 1} Uhr: ${n} Verkäufe">
            <div class="balken" style="height:${n / maxStunde * 100}%"></div>
            <span class="beschr">${(von + i) % 3 === 0 ? von + i : ''}</span></div>`).join('')}
        </div>
        <p class="leise klein">Zeigt, wann am meisten los ist – gut zum Planen der Nachfüll-Touren.</p>
      </div>`;

    document.getElementById('zeitraum').addEventListener('change', e => { statistikTage = Number(e.target.value); zeichnen(); });
  }

  /* ========== 4. Sortiment & Preise ========== */
  function sortiment(ziel) {
    const automaten = S.alleAutomaten();
    ziel.innerHTML = `
      <div class="box abschnitt">
        <div class="abschnitt-kopf"><h2>Sortiment & Preise</h2>
          <button class="knopf leise klein" id="zuruecksetzen">↺ Demo zurücksetzen</button></div>
        <p class="leise klein" style="margin-top:-6px">Preis ändern = sofort auf der Kunden-Seite sichtbar. Angebotspreis eintragen = Produkt wird als „Angebot“ markiert (Feld leeren beendet es). Häkchen = Produkt ist in diesem Automaten.
          Neu hinzugefügte Produkte sind zuerst leer und müssen nachgefüllt werden.</p>
        <div class="tabelle-huelle" tabindex="0" role="region" aria-label="Tabelle, seitlich scrollbar"><table class="tabelle">
          <thead><tr><th>Produkt</th><th class="zahl">Einkauf netto</th><th class="zahl">Verkauf brutto</th><th class="zahl" title="Angebotspreis – leer lassen für kein Angebot">Angebot</th><th class="zahl">Gewinn/Stk</th><th class="zahl">Marge</th>
            ${automaten.map(a => `<th class="mitte" title="${S.esc(a.name)}">${S.typen[a.typ].emoji}<br><span class="klein">${S.esc(a.name.replace(' St. Pölten', ''))}</span></th>`).join('')}</tr></thead>
          <tbody>${S.alleProdukte().map(p => {
            const gewinn = S.gewinnProStueck(p);
            const marge = gewinn == null ? null : gewinn / (p.preis / (1 + p.ust));
            const geaendert = p.normalPreis != null && (p.originalPreis == null || Math.abs(p.normalPreis - p.originalPreis) > 0.001);
            return `<tr><td>${p.emoji} ${S.esc(p.name)}<br><span class="klein leise">${S.portionText(p)} · ${S.esc(p.lieferant)}</span></td>
              <td class="zahl">${p.einkauf == null ? '<span class="leise">offen</span>' : S.euro(p.einkauf)}</td>
              <td class="zahl"><input type="number" step="0.05" min="0.1" value="${p.normalPreis == null ? '' : p.normalPreis.toFixed(2)}" placeholder="folgt" data-preis="${p.id}" class="${geaendert ? 'geaendert' : ''}" aria-label="Preis ${S.esc(p.name)}"></td>
              <td class="zahl"><input type="number" step="0.05" min="0.1" value="${p.angebot ? p.preis.toFixed(2) : ''}" placeholder="–" data-angebot="${p.id}" class="${p.angebot ? 'geaendert' : ''}" aria-label="Angebotspreis ${S.esc(p.name)}" ${p.normalPreis == null ? 'disabled' : ''}></td>
              <td class="zahl">${gewinn == null ? '<span class="leise">–</span>' : S.euro(gewinn)}</td>
              <td class="zahl">${marge == null ? '<span class="leise">–</span>' : Math.round(marge * 100) + ' %'}</td>
              ${automaten.map(a => `<td class="mitte"><input type="checkbox" data-sortiment="${a.id}|${p.id}" ${S.sortiment(a.id).includes(p.id) ? 'checked' : ''} aria-label="${S.esc(p.name)} in ${S.esc(a.name)}"></td>`).join('')}
            </tr>`;
          }).join('')}</tbody>
        </table></div>
        <p class="leise klein">Gewinn = Verkaufspreis ohne USt minus Einkauf (bei Angeboten mit dem Angebotspreis). Preise ohne Pfand. Werte aus der Produkttabelle (Luis Till).</p>
      </div>`;

    ziel.querySelectorAll('[data-preis]').forEach(inp => inp.addEventListener('change', () => {
      const wert = parseFloat(inp.value.replace(',', '.'));
      if (wert > 0) { S.preisSetzen(inp.dataset.preis, wert); meldung('Preis gespeichert'); }
    }));
    ziel.querySelectorAll('[data-angebot]').forEach(inp => inp.addEventListener('change', () => {
      const id = inp.dataset.angebot;
      const wert = parseFloat(inp.value.replace(',', '.'));
      if (!(wert > 0)) {
        if (S.produkt(id).angebot) { S.angebotSetzen(id, null); meldung('Angebot beendet'); }
        inp.value = ''; return;
      }
      if (S.produkt(id).normalPreis == null || wert >= S.produkt(id).normalPreis) { inp.value = ''; meldung('Das Angebot muss günstiger als der normale Preis sein'); return; }
      S.angebotSetzen(id, wert); meldung('Angebot gespeichert – Kunden sehen es sofort');
    }));
    ziel.querySelectorAll('[data-sortiment]').forEach(cb => cb.addEventListener('change', () => {
      const [aId, pId] = cb.dataset.sortiment.split('|');
      S.sortimentUmschalten(aId, pId);
      meldung(cb.checked ? 'Produkt hinzugefügt – bitte nachfüllen' : 'Produkt entfernt');
    }));
    document.getElementById('zuruecksetzen').addEventListener('click', () => {
      if (confirm('Alle Änderungen (Preise, Sortiment, Bestand, Wünsche) auf die Demo-Daten zurücksetzen?')) {
        S.zuruecksetzen(); meldung('Demo-Daten zurückgesetzt');
      }
    });
  }

  /* ========== 5. Finanzen (Finanzplan Pilotautomat Schule) ========== */
  // Kopie der Werte aus finanzen.js – Änderungen hier sind nur zum Ausprobieren
  const planKopie = () => JSON.parse(JSON.stringify(window.PICKD_FINANZPLAN));
  let finanzPlan = planKopie();

  function euro0(wert) {
    return wert.toLocaleString('de-AT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  }
  function vorzeichenKlasse(wert) { return wert < 0 ? 'minus' : 'plus'; }

  function finanzen(ziel) {
    const plan = finanzPlan;
    const r = window.PICKD_FINANZEN_RECHNEN(plan);
    const gewaehlt = r.szenarien[plan.gewaehltesSzenario];
    const be = r.breakEven;
    const beText = isFinite(be) ? Math.ceil(be) : '–';
    const besterTag = Math.max(...r.szenarien.map(s => s.proTag));
    const alleMinus = r.szenarien.every(s => s.ergebnis < 0);
    const geaendert = JSON.stringify(plan) !== JSON.stringify(window.PICKD_FINANZPLAN);

    // Fazit in einem Satz – richtet sich nach den aktuellen Zahlen
    let fazit;
    if (!isFinite(be)) fazit = 'Mit diesen Annahmen verdient der Automat an keinem Verkauf etwas – die Preise decken den Einkauf nicht.';
    else if (alleMinus && be > besterTag) fazit = `Mit diesen Annahmen macht der Automat im 1. Jahr in allen drei Szenarien Verlust. Die laufenden Kosten sind erst ab rund <strong>${beText} Verkäufen pro Schultag</strong> gedeckt – mehr als im optimistischen Szenario (${besterTag}).`;
    else if (alleMinus) fazit = `Im 1. Jahr bleibt jedes Szenario im Minus, weil die Startkosten dazukommen. Laufend gedeckt sind die Kosten ab rund <strong>${beText} Verkäufen pro Schultag</strong>.`;
    else fazit = `Ab rund <strong>${beText} Verkäufen pro Schultag</strong> sind die laufenden Kosten gedeckt. Im gewählten Szenario (${gewaehlt.name}) liegt das Ergebnis im 1. Jahr bei <strong>${euro0(gewaehlt.ergebnis)}</strong>.`;

    // Balken: Szenarien im Vergleich zum Break-even
    const skala = Math.max(isFinite(be) ? be : 0, besterTag) * 1.12 || 1;
    const beLinks = isFinite(be) ? Math.min(be / skala * 100, 100) : null;

    // Liquidität: Säulen nach oben (Plus) oder unten (Minus)
    const maxPlus = Math.max(0, ...r.monate.map(m => m.ende));
    const maxMinus = Math.max(0, ...r.monate.map(m => -m.ende));
    const spanne = maxPlus + maxMinus || 1;
    const nullLinie = maxPlus / spanne * 100;

    const zelle = w => {
      if (typeof w !== 'number') return `<td class="zahl">${w}</td>`;
      if (Math.abs(w) < 0.5) return '<td class="zahl leise">–</td>';
      return `<td class="zahl ${vorzeichenKlasse(w)}">${euro0(w)}</td>`;
    };
    const zeile = (titel, werte, klasse) => `<tr class="${klasse || ''}"><td>${titel}</td>${werte.map(zelle).join('')}</tr>`;
    const eingabe = (id, label, wert, einheit, schritt, min) => `
      <label class="eingabe-feld" for="${id}"><span>${label}</span>
        <span class="eingabe-zeile"><input type="number" id="${id}" value="${wert}" step="${schritt}" min="${min}" inputmode="decimal"><span class="einheit">${einheit}</span></span></label>`;
    const miete = plan.fixkosten[0];

    ziel.innerHTML = `
      <div class="box abschnitt">
        <div class="abschnitt-kopf"><h2>Finanzplan Pilotautomat Schule</h2>
          ${geaendert ? '<button class="knopf leise klein" id="finanz-zurueck">↺ Excel-Werte</button>' : ''}</div>
        <p class="leise klein" style="margin-top:-6px">Zitzmann AZ500 an einer Schule · 1. Geschäftsjahr · alle Beträge netto · gleiche Formeln wie <code>${S.esc(plan.quelle)}</code>${geaendert ? ' · <strong>Annahmen geändert (nur zum Ausprobieren)</strong>' : ''}</p>
        <p class="fazit ${alleMinus ? 'warnung' : ''}">${fazit}</p>
      </div>

      <div class="kpis">
        <div class="box kpi"><div class="titel">Ø Gewinn je Verkauf</div><div class="wert">${S.euro(r.oDB)}</div><div class="unter">${Math.round(r.oDBProzent * 100)} % vom Nettopreis ${S.euro(r.oNetto)}</div></div>
        <div class="box kpi ${be > besterTag ? 'warnung' : ''}"><div class="titel">Break-even</div><div class="wert">${beText}</div><div class="unter">Verkäufe pro Schultag nötig</div></div>
        <div class="box kpi ${gewaehlt.ergebnis < 0 ? 'warnung' : ''}"><div class="titel">Ergebnis Jahr 1</div><div class="wert">${euro0(gewaehlt.ergebnis)}</div><div class="unter">${S.esc(gewaehlt.name)} · ${gewaehlt.proTag} pro Tag</div></div>
        <div class="box kpi"><div class="titel">Startkapital nötig</div><div class="wert">${euro0(r.startkapitalNoetig)}</div><div class="unter">mindestens, damit das Konto nie ins Minus geht</div></div>
      </div>

      <div class="box abschnitt">
        <h2>Verkäufe pro Schultag im Vergleich zum Break-even</h2>
        <div class="hbalken szenario-balken">${r.szenarien.map((s, i) => `
          <div class="zeile"><span class="name">${S.esc(s.name)}${i === plan.gewaehltesSzenario ? ' <span class="leise klein">· gewählt</span>' : ''}</span>
            <div class="spur">${beLinks != null ? `<b class="be-linie" style="left:${beLinks}%"></b>` : ''}<i class="${s.proTag >= be ? 'gut' : 'knapp'}" style="width:${s.proTag / skala * 100}%"></i></div>
            <span class="zahl">${s.proTag} / Tag</span></div>`).join('')}
        </div>
        <p class="leise klein">Strich = Break-even bei ${isFinite(be) ? S.zahl(be, 1) : '–'} Verkäufen pro Schultag (laufende Kosten inkl. Abschreibung, ohne einmalige Startkosten).</p>
      </div>

      <div class="box abschnitt">
        <h2 style="margin-bottom:10px">Ergebnis 1. Jahr – drei Szenarien</h2>
        <div class="tabelle-huelle" tabindex="0" role="region" aria-label="Szenarien Jahr 1, seitlich scrollbar"><table class="tabelle finanz-tabelle">
          <thead><tr><th>Kennzahl</th>${r.szenarien.map((s, i) => `<th class="zahl ${i === plan.gewaehltesSzenario ? 'gewaehlt' : ''}">${S.esc(s.name)}</th>`).join('')}</tr></thead>
          <tbody>
            ${zeile('Verkäufe pro Schultag', r.szenarien.map(s => String(s.proTag)))}
            ${zeile(`Verkäufe pro Jahr (${r.schultage} Schultage)`, r.szenarien.map(s => s.verkaeufe.toLocaleString('de-AT')))}
            ${zeile('Umsatz netto', r.szenarien.map(s => s.umsatz))}
            ${zeile('− Wareneinsatz', r.szenarien.map(s => -s.ware))}
            ${zeile('Deckungsbeitrag', r.szenarien.map(s => s.db), 'zwischen')}
            ${r.beteiligung ? zeile('− Umsatzbeteiligung Schule', r.szenarien.map(s => -s.anteilSchule)) : ''}
            ${zeile('− Fixkosten (12 Monate)', r.szenarien.map(s => -s.fix))}
            ${zeile('− einmalige Startkosten', r.szenarien.map(s => -s.startkosten))}
            ${zeile('− Abschreibung Automat', r.szenarien.map(s => -s.abschreibung))}
            ${zeile('Ergebnis Jahr 1', r.szenarien.map(s => s.ergebnis), 'summe')}
          </tbody>
        </table></div>
      </div>

      <div class="box abschnitt">
        <h2>Kontostand im 1. Jahr</h2>
        <p class="leise klein" style="margin-top:4px">Szenario ${S.esc(gewaehlt.name)} (${gewaehlt.proTag} Verkäufe pro Schultag), Startkapital ${euro0(plan.startkapital || 0)}. Im Sommer sind Schulferien: keine Verkäufe, aber Fixkosten.</p>
        <div class="liqui" role="img" aria-label="Kontostand am Monatsende: ${r.monate.map(m => m.monat + ' ' + euro0(m.ende)).join(', ')}">
          <span class="null-linie" style="top:${nullLinie}%"></span>
          ${r.monate.map(m => {
            const h = Math.abs(m.ende) / spanne * 100;
            const oben = m.ende >= 0 ? nullLinie - h : nullLinie;
            return `<div class="liqui-spalte" title="${m.monat}: ${euro0(m.ende)}"><i class="${vorzeichenKlasse(m.ende)}" style="top:${oben}%;height:${Math.max(h, 0.6)}%"></i><span class="beschr">${m.monat}</span></div>`;
          }).join('')}
        </div>
        <div class="tabelle-huelle" tabindex="0" role="region" aria-label="Liquiditätsplan, seitlich scrollbar"><table class="tabelle finanz-tabelle liqui-tabelle">
          <thead><tr><th>Position</th>${r.monate.map(m => `<th class="zahl">${m.monat}</th>`).join('')}</tr></thead>
          <tbody>
            ${zeile('Verkäufe', r.monate.map(m => m.verkaeufe.toLocaleString('de-AT')))}
            ${zeile('+ Einnahmen', r.monate.map(m => m.ein))}
            ${zeile('− Gründungskosten', r.monate.map(m => -m.aus.gruendung))}
            ${zeile('− Wareneinkauf', r.monate.map(m => -m.aus.ware))}
            ${r.beteiligung ? zeile('− Umsatzbeteiligung', r.monate.map(m => -m.aus.beteiligung)) : ''}
            ${zeile('− Fixkosten', r.monate.map(m => -m.aus.fix))}
            ${zeile('Kontostand Ende', r.monate.map(m => m.ende), 'summe')}
          </tbody>
        </table></div>
        <p class="leise klein">Vereinfachung wie in der Excel-Datei: Wareneinkauf = verkaufte Menge, die Erstbefüllung bleibt als Lager. Keine USt-Zahlungen und Steuern.</p>
      </div>

      <div class="box abschnitt">
        <h2>Annahmen ausprobieren</h2>
        <p class="leise klein" style="margin:4px 0 12px">Was wäre, wenn …? Änderungen rechnen sofort neu, werden aber nicht gespeichert. Die festen Werte stehen in <code>finanzen.js</code>.</p>
        <div class="eingaben">
          ${plan.szenarien.map((s, i) => eingabe('fin-sz-' + i, `Verkäufe/Tag ${s.name.toLowerCase()}`, s.verkaeufeProTag, 'Stk', 1, 0)).join('')}
          <label class="eingabe-feld" for="fin-gewaehlt"><span>Szenario für den Kontostand</span>
            <select class="auswahl" id="fin-gewaehlt">${plan.szenarien.map((s, i) => `<option value="${i}" ${i === plan.gewaehltesSzenario ? 'selected' : ''}>${S.esc(s.name)}</option>`).join('')}</select></label>
          ${eingabe('fin-miete', 'Standortmiete pro Monat', miete.betrag, '€', 10, 0)}
          ${eingabe('fin-beteiligung', 'Umsatzbeteiligung Schule', Math.round(plan.umsatzbeteiligung * 1000) / 10, '%', 1, 0)}
          ${eingabe('fin-startkapital', 'Startkapital', plan.startkapital, '€', 500, 0)}
          ${eingabe('fin-dauer', 'Nutzungsdauer Automat', plan.nutzungsdauerJahre, 'Jahre', 1, 1)}
        </div>
      </div>

      <div class="zwei-spalten">
        <div class="box abschnitt">
          <h2 style="margin-bottom:10px">Gründungskosten</h2>
          <ul class="kosten-liste">${plan.gruendung.map(g => `<li><span>${S.esc(g.name)}${g.offen ? ' <span class="status fast">offen</span>' : ''}</span><strong>${euro0(g.betrag)}</strong></li>`).join('')}
            <li class="summe"><span>Gesamt</span><strong>${euro0(r.gruendung)}</strong></li></ul>
          <p class="leise klein">Abschreibung: ${euro0(r.abschreibbar)} über ${plan.nutzungsdauerJahre} Jahre = ${euro0(r.abschreibung)} pro Jahr.</p>
        </div>
        <div class="box abschnitt">
          <h2 style="margin-bottom:10px">Laufende Kosten pro Monat</h2>
          <ul class="kosten-liste">${plan.fixkosten.map(f => `<li><span>${S.esc(f.name)}</span><strong>${euro0(f.betrag)}</strong></li>`).join('')}
            <li class="summe"><span>Gesamt</span><strong>${euro0(r.fixMonat)}</strong></li></ul>
          <p class="leise klein">Fast alles sind Team-Schätzungen. An der Schule ist statt Miete auch eine Umsatzbeteiligung möglich.</p>
        </div>
      </div>

      <div class="zwei-spalten">
        <div class="box abschnitt">
          <h2 style="margin-bottom:10px">Sortiment im Pilot</h2>
          <p class="klein" style="margin:0 0 8px">${plan.sortiment.filter(s => s.gewicht > 0).length} Produkte, alle gleich gewichtet. Ø Verkauf ${S.euro(r.oNetto)}, Ø Einkauf ${S.euro(r.oEinkauf)} (netto).</p>
          <ul class="hinweis-liste">${plan.sortiment.filter(s => s.hinweis).map(s =>
            `<li><span class="status ${s.gewicht ? 'fast' : 'leer'}">${s.gewicht ? 'prüfen' : 'nicht dabei'}</span><span><strong>${S.esc(s.name)}</strong> – ${S.esc(s.hinweis)}</span></li>`).join('')}</ul>
          <p class="leise klein">Gerechnet mit dem Sortiment aus der Excel-Datei (19 Produkte). Das neue 38er-Sortiment ist noch nicht eingerechnet, weil Preise fehlen.</p>
        </div>
        <div class="box abschnitt">
          <h2 style="margin-bottom:10px">Noch offen im Finanzplan</h2>
          <ul class="hinweis-liste">${plan.offenePunkte.map(t => `<li><span class="status fast">offen</span><span>${S.esc(t)}</span></li>`).join('')}</ul>
        </div>
      </div>`;

    // Eingaben: neu rechnen und Fokus behalten
    function neu(id) {
      finanzen(ziel);
      const el = document.getElementById(id);
      if (el) { el.focus(); if (el.select && el.type === 'number') el.select(); }
    }
    const zahl = el => { const w = parseFloat(String(el.value).replace(',', '.')); return isFinite(w) && w >= 0 ? w : null; };
    plan.szenarien.forEach((s, i) => ziel.querySelector('#fin-sz-' + i).addEventListener('change', e => {
      const w = zahl(e.target); if (w != null) s.verkaeufeProTag = w; neu(e.target.id);
    }));
    ziel.querySelector('#fin-gewaehlt').addEventListener('change', e => { plan.gewaehltesSzenario = Number(e.target.value); neu(e.target.id); });
    ziel.querySelector('#fin-miete').addEventListener('change', e => { const w = zahl(e.target); if (w != null) miete.betrag = w; neu(e.target.id); });
    ziel.querySelector('#fin-beteiligung').addEventListener('change', e => { const w = zahl(e.target); if (w != null) plan.umsatzbeteiligung = Math.min(w, 100) / 100; neu(e.target.id); });
    ziel.querySelector('#fin-startkapital').addEventListener('change', e => { const w = zahl(e.target); if (w != null) plan.startkapital = w; neu(e.target.id); });
    ziel.querySelector('#fin-dauer').addEventListener('change', e => { const w = zahl(e.target); if (w != null && w >= 1) plan.nutzungsdauerJahre = w; neu(e.target.id); });
    const zurueck = ziel.querySelector('#finanz-zurueck');
    if (zurueck) zurueck.addEventListener('click', () => { finanzPlan = planKopie(); finanzen(ziel); meldung('Werte aus der Excel-Datei wiederhergestellt'); });
  }

  ansichtWaehlen();
})();
