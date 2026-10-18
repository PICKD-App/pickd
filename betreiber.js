/* =========================================================
   PICKD – Betreiber-Bereich
   Login · Übersicht · Bestand & Nachfüllen · Statistik · Sortiment
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
    verkaeufe.forEach(v => { const p = S.produkt(v[2]); umsatz += p.preis; gewinn += S.gewinnProStueck(p); });
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
    ({ uebersicht: uebersicht, bestand: bestand, statistik: statistik, sortiment: sortiment })[aktuellerTab](ziel);
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
        <div class="tabelle-huelle"><table class="tabelle">
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
          <div class="zeile"><span class="name" title="${S.esc(w.text)}">${S.esc(w.text)} <span class="leise klein">· ${S.esc(S.automat(w.automat).name)}</span></span>
          <div class="spur"><i style="width:${w.likes / top[0].likes * 100}%"></i></div><span class="zahl">${w.likes} 👍</span></div>`).join('')}</div>`
          : '<p class="leise">Noch keine Wünsche.</p>'}
      </div>`;

    document.getElementById('simulieren').addEventListener('click', () => {
      const v = S.verkaufSimulieren();
      if (v) meldung(`Verkauft: ${v.produkt.name} @ ${v.automat.name}`);
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
        <select class="auswahl" id="zeitraum">
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
        <p class="leise klein" style="margin-top:-6px">Preis ändern = sofort auf der Kunden-Seite sichtbar. Häkchen = Produkt ist in diesem Automaten.
          Neu hinzugefügte Produkte sind zuerst leer und müssen nachgefüllt werden.</p>
        <div class="tabelle-huelle"><table class="tabelle">
          <thead><tr><th>Produkt</th><th class="zahl">Einkauf netto</th><th class="zahl">Verkauf brutto</th><th class="zahl">Gewinn/Stk</th><th class="zahl">Marge</th>
            ${automaten.map(a => `<th class="mitte" title="${S.esc(a.name)}">${S.typen[a.typ].emoji}<br><span class="klein">${S.esc(a.name.replace(' St. Pölten', ''))}</span></th>`).join('')}</tr></thead>
          <tbody>${S.alleProdukte().map(p => {
            const gewinn = S.gewinnProStueck(p);
            const marge = gewinn / (p.preis / (1 + p.ust));
            const geaendert = Math.abs(p.preis - p.originalPreis) > 0.001;
            return `<tr><td>${p.emoji} ${S.esc(p.name)}<br><span class="klein leise">${S.portionText(p)} · ${S.esc(p.lieferant)}</span></td>
              <td class="zahl">${S.euro(p.einkauf)}</td>
              <td class="zahl"><input type="number" step="0.05" min="0.1" value="${p.preis.toFixed(2)}" data-preis="${p.id}" class="${geaendert ? 'geaendert' : ''}" aria-label="Preis ${S.esc(p.name)}"></td>
              <td class="zahl">${S.euro(gewinn)}</td>
              <td class="zahl">${Math.round(marge * 100)} %</td>
              ${automaten.map(a => `<td class="mitte"><input type="checkbox" data-sortiment="${a.id}|${p.id}" ${S.sortiment(a.id).includes(p.id) ? 'checked' : ''} aria-label="${S.esc(p.name)} in ${S.esc(a.name)}"></td>`).join('')}
            </tr>`;
          }).join('')}</tbody>
        </table></div>
        <p class="leise klein">Gewinn = Verkaufspreis ohne USt minus Einkauf. Werte aus der Produkttabelle (Luis Till).</p>
      </div>`;

    ziel.querySelectorAll('[data-preis]').forEach(inp => inp.addEventListener('change', () => {
      const wert = parseFloat(inp.value.replace(',', '.'));
      if (wert > 0) { S.preisSetzen(inp.dataset.preis, wert); meldung('Preis gespeichert'); }
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

  ansichtWaehlen();
})();
