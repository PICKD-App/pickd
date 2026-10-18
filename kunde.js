/* =========================================================
   PICKD – Kunden-Seite
   Karte · Automaten-Ansicht · Filter · Produktdetails · Wünsche
   ========================================================= */
(function () {
  const S = window.PICKD;
  const KATEGORIEN = ['Riegel', 'Snack', 'Gekühlt', 'Getränk'];
  const KATEGORIE_TITEL = { Riegel: 'Riegel', Snack: 'Snacks', Gekühlt: 'Gekühlt', Getränk: 'Getränke' };

  let aktiveFilter = [];
  let aktuellerAutomat = null;
  let karte = null;
  const marker = {};

  S.kopfEinrichten();

  /* ---------- Zählen: was ist in einem Automaten verfügbar? ---------- */
  function zaehle(automatId) {
    const z = { ok: 0, fast: 0, leer: 0, passend: 0 };
    S.sortiment(automatId).forEach(id => {
      const n = S.bestand(automatId, id);
      z[S.status(n)]++;
      if (n > 0 && S.passtZuFiltern(S.produkt(id), aktiveFilter)) z.passend++;
    });
    return z;
  }

  /* ---------- Filter ---------- */
  function filterZeichnen() {
    document.querySelectorAll('[data-filterleiste]').forEach(leiste => {
      leiste.innerHTML = S.FILTER.map(f =>
        `<button class="chip" data-filter="${f.key}" aria-pressed="${aktiveFilter.includes(f.key)}">${f.emoji} ${f.text}</button>`
      ).join('') + (aktiveFilter.length ? '<button class="chip chip-leeren" data-filter-leeren>Filter löschen</button>' : '');
    });
  }
  document.addEventListener('click', e => {
    const chip = e.target.closest('[data-filter]');
    if (chip) {
      const key = chip.dataset.filter;
      aktiveFilter = aktiveFilter.includes(key) ? aktiveFilter.filter(k => k !== key) : aktiveFilter.concat(key);
      allesNeuZeichnen();
    }
    if (e.target.closest('[data-filter-leeren]')) { aktiveFilter = []; allesNeuZeichnen(); }
  });

  /* ---------- Karte ---------- */
  function karteStarten() {
    if (typeof L === 'undefined') {
      document.getElementById('karte').innerHTML = '<div class="leer-hinweis">Karte konnte nicht geladen werden (keine Internetverbindung?).</div>';
      return;
    }
    karte = L.map('karte', { scrollWheelZoom: true }).setView(S.config.karte.zentrum, S.config.karte.zoom);
    const kacheln = L.tileLayer(S.config.karte.kacheln, { maxZoom: 19, attribution: S.config.karte.quelle }).addTo(karte);
    // Falls die Kartenbilder blockiert werden (z.B. Datei per Doppelklick geöffnet), auf Ersatz-Karte wechseln
    let fehler = 0;
    kacheln.on('tileerror', () => {
      if (++fehler !== 3 || !S.config.karte.ersatzKacheln) return;
      karte.removeLayer(kacheln);
      L.tileLayer(S.config.karte.ersatzKacheln, { maxZoom: 19, attribution: S.config.karte.ersatzQuelle }).addTo(karte);
    });

    S.alleAutomaten().forEach(a => {
      marker[a.id] = L.marker(a.koordinaten, { icon: pinIcon(a), title: a.name, riseOnHover: true })
        .addTo(karte)
        .bindTooltip(a.name, { direction: 'top', offset: [0, -48] })
        .on('click', () => { location.hash = '#/automat/' + a.id; });
    });
  }

  // Ausschnitt so wählen, dass alle Automaten sichtbar sind – erst wenn die Karte sichtbar ist
  let karteEingepasst = false;
  function karteEinpassen() {
    if (!karte || !document.getElementById('karte').offsetWidth) return;
    karte.invalidateSize();
    if (!karteEingepasst) {
      karte.fitBounds(S.alleAutomaten().map(a => a.koordinaten), { padding: [40, 40] });
      karteEingepasst = true;
    }
  }

  function pinIcon(a) {
    const z = zaehle(a.id);
    const zahl = aktiveFilter.length ? z.passend : z.ok + z.fast;
    const gedimmt = aktiveFilter.length && !z.passend;
    return L.divIcon({
      className: 'pin-huelle',
      html: `<div class="pin ${gedimmt ? 'gedimmt' : ''}"><span>${S.typen[a.typ].emoji}</span><b>${zahl}</b></div>`,
      iconSize: [44, 44], iconAnchor: [22, 50]
    });
  }

  function karteAktualisieren() {
    if (!karte) return;
    S.alleAutomaten().forEach(a => marker[a.id] && marker[a.id].setIcon(pinIcon(a)));
  }

  /* ---------- Liste neben der Karte ---------- */
  function listeZeichnen() {
    const automaten = S.alleAutomaten().map(a => ({ a, z: zaehle(a.id) }));
    if (aktiveFilter.length) automaten.sort((x, y) => y.z.passend - x.z.passend);
    document.getElementById('liste-titel').textContent = aktiveFilter.length
      ? 'Automaten mit passenden Produkten' : 'Alle Automaten (' + automaten.length + ')';

    const keinTreffer = aktiveFilter.length && automaten.every(x => !x.z.passend);
    document.getElementById('automaten-liste').innerHTML = (keinTreffer
      ? '<div class="box leer-hinweis">Gerade gibt es kein Produkt, das zu <strong>allen</strong> gewählten Filtern passt. Probier weniger Filter.</div>' : '') +
      automaten.map(({ a, z }) => {
      const typ = S.typen[a.typ];
      const gedimmt = aktiveFilter.length && !z.passend;
      const zeile = aktiveFilter.length
        ? `<div class="ampel"><span><i class="punkt ${z.passend ? 'ok' : 'leer'}"></i>${z.passend} passende${z.passend === 1 ? 's' : ''} Produkt${z.passend === 1 ? '' : 'e'} verfügbar</span></div>`
        : `<div class="ampel"><span><i class="punkt ok"></i>${z.ok} verfügbar</span>${z.fast ? `<span><i class="punkt fast"></i>${z.fast} fast leer</span>` : ''}${z.leer ? `<span><i class="punkt leer"></i>${z.leer} aus</span>` : ''}</div>`;
      return `<a class="box automat-karte ${gedimmt ? 'gedimmt' : ''}" href="#/automat/${a.id}" style="text-decoration:none">
        <div class="typ-icon">${typ.emoji}</div>
        <div><div class="titel">${S.esc(a.name)}</div><div class="info">${typ.name} · ${S.esc(a.adresse)}</div>${zeile}</div>
        <span class="pfeil">›</span></a>`;
    }).join('');
  }

  /* ---------- Automaten-Ansicht ---------- */
  function automatZeichnen() {
    const a = S.automat(aktuellerAutomat);
    if (!a) { location.hash = '#/'; return; }
    const typ = S.typen[a.typ];
    const z = zaehle(a.id);
    const route = `https://www.google.com/maps/dir/?api=1&destination=${a.koordinaten[0]},${a.koordinaten[1]}`;

    document.getElementById('automat-kopf').innerHTML = `
      <div class="box automat-kopf">
        <div class="typ-icon">${typ.emoji}</div>
        <div>
          <h1>${S.esc(a.name)}</h1>
          <div class="info">${typ.name} · ${S.esc(a.adresse)}</div>
          <div class="info">${S.esc(a.beschreibung || '')}</div>
          <div class="ampel"><span><i class="punkt ok"></i>${z.ok} verfügbar</span><span><i class="punkt fast"></i>${z.fast} fast leer</span><span><i class="punkt leer"></i>${z.leer} ausverkauft</span></div>
        </div>
        <div class="aktionen"><a class="knopf leise" href="${route}" target="_blank" rel="noopener">🧭 Route</a></div>
      </div>`;

    // Produkte nach Kategorie gruppieren, verfügbare zuerst
    const produkte = S.sortiment(a.id).map(id => S.produkt(id)).filter(p => S.passtZuFiltern(p, aktiveFilter));
    let html = '';
    KATEGORIEN.forEach(kat => {
      const liste = produkte.filter(p => p.kategorie === kat)
        .sort((x, y) => (S.bestand(a.id, y.id) > 0) - (S.bestand(a.id, x.id) > 0) || x.name.localeCompare(y.name));
      if (!liste.length) return;
      html += `<h2 class="kategorie-titel">${KATEGORIE_TITEL[kat]}</h2><div class="produkt-raster">` +
        liste.map(p => {
          const n = S.bestand(a.id, p.id);
          return `<button class="box produkt-karte ${n ? '' : 'leer'}" data-produkt="${p.id}">
            ${S.produktBild(p)}
            <div class="name">${S.esc(p.name)}</div>
            <div class="portion">${S.portionText(p)}</div>
            ${S.labelsHtml(p)}
            <div class="unten"><span class="preis">${S.euro(p.preis)}</span>${S.statusHtml(n)}</div>
          </button>`;
        }).join('') + '</div>';
    });
    document.getElementById('automat-produkte').innerHTML = html ||
      '<div class="box leer-hinweis">Kein Produkt in diesem Automaten passt zu deinen Filtern.</div>';

    wuenscheZeichnen(a);
  }

  /* ---------- Produktwünsche ---------- */
  function wuenscheZeichnen(a) {
    const liste = S.wuensche(a.id);
    document.getElementById('automat-wuensche').innerHTML = `
      <section class="box wuensche">
        <h2>💡 Produktwünsche</h2>
        <p class="unterzeile">Was fehlt dir hier? Wünsch dir ein Produkt oder unterstütze die Wünsche anderer – die beliebtesten kommen ins Sortiment.</p>
        <form class="wunsch-form" id="wunsch-form">
          <input class="eingabe" id="wunsch-eingabe" aria-label="Produktwunsch" maxlength="60" placeholder="z.B. Proteinshake Vanille" autocomplete="off" required>
          <button class="knopf" type="submit">Wünschen</button>
        </form>
        <ul class="wunsch-liste">
          ${liste.length ? liste.map(w => `
            <li class="wunsch"><span class="text">${S.esc(w.text)}</span>
              <button class="like" data-like="${w.id}" aria-pressed="${S.wunschGeliked(w.id)}" title="Will ich auch">👍 ${w.likes}</button></li>`).join('')
            : '<li class="leer-hinweis" style="padding:8px">Noch keine Wünsche – sei die/der Erste!</li>'}
        </ul>
      </section>`;
    document.getElementById('wunsch-form').addEventListener('submit', e => {
      e.preventDefault();
      const eingabe = document.getElementById('wunsch-eingabe');
      if (S.wunschHinzufuegen(a.id, eingabe.value)) eingabe.value = '';
    });
  }
  document.addEventListener('click', e => {
    const like = e.target.closest('[data-like]');
    if (like) S.wunschLiken(like.dataset.like);
  });

  /* ---------- Produkt-Details ---------- */
  function produktOeffnen(id) {
    const p = S.produkt(id);
    const n = p.naehrwerte;
    const faktor = p.portion / 100;
    const einheit100 = p.einheit === 'ml' ? '100 ml' : '100 g';
    const zeilen = [
      ['Energie', n.kcal, 'kcal', true], ['Fett', n.fett, 'g'], ['Kohlenhydrate', n.kohlenhydrate, 'g'],
      ['davon Zucker', n.zucker, 'g'], ['Eiweiß', n.eiweiss, 'g', true], ['Salz', n.salz, 'g']
    ];
    const hier = aktuellerAutomat ? S.bestand(aktuellerAutomat, id) : null;
    const andere = S.alleAutomaten().filter(a => a.id !== aktuellerAutomat && S.sortiment(a.id).includes(id));

    document.getElementById('produkt-detail').innerHTML = `
      <div class="detail-kopf">
        ${S.produktBild(p)}
        <div><h2>${S.esc(p.name)}</h2>
          <div class="info" style="color:var(--farbe-text-leise)">${S.portionText(p)} · <strong style="color:var(--farbe-text)">${S.euro(p.preis)}</strong></div>
          ${hier != null ? `<div style="margin-top:6px">${S.statusHtml(hier)} <span style="font-size:12.5px;color:var(--farbe-text-leise)">${hier ? 'noch ' + hier + ' Stück hier' : ''}</span></div>` : ''}
        </div>
      </div>
      ${S.labelsHtml(p)}
      <h3>Nährwerte</h3>
      <table class="tabelle">
        <thead><tr><th></th><th class="zahl">pro ${einheit100}</th><th class="zahl">pro Packung (${S.portionText(p)})</th></tr></thead>
        <tbody>${zeilen.map(([name, wert, e, hervor]) => `
          <tr class="${hervor ? 'hervor' : ''}"><td>${name}</td><td class="zahl">${S.zahl(wert)} ${e}</td><td class="zahl">${S.zahl(wert * faktor)} ${e}</td></tr>`).join('')}
        </tbody>
      </table>
      <p class="quelle ${p.geprueft ? '' : 'ungeprueft'}">Quelle: ${S.esc(p.quelle)}${p.geprueft ? '' : ' (Richtwert)'}</p>
      ${andere.length ? `<h3>${aktuellerAutomat ? 'Auch erhältlich in' : 'Erhältlich in'}</h3>
        <ul class="verfuegbar-liste">${andere.map(a => `
          <li><a href="#/automat/${a.id}" data-dialog-schliessen>${S.typen[a.typ].emoji} ${S.esc(a.name)} ${S.statusHtml(S.bestand(a.id, id))}</a></li>`).join('')}
        </ul>` : ''}`;
    const dialog = document.getElementById('produkt-dialog');
    if (!dialog.open) dialog.showModal();
  }
  document.addEventListener('click', e => {
    const karteBtn = e.target.closest('[data-produkt]');
    if (karteBtn) produktOeffnen(karteBtn.dataset.produkt);
    if (e.target.closest('[data-dialog-schliessen]')) document.getElementById('produkt-dialog').close();
  });
  // Klick neben den Dialog schließt ihn
  document.getElementById('produkt-dialog').addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  });

  /* ---------- Navigation (#/ und #/automat/id) ---------- */
  function route() {
    const teile = location.hash.replace(/^#\/?/, '').split('/');
    const istAutomat = teile[0] === 'automat' && teile[1];
    aktuellerAutomat = istAutomat ? teile[1] : null;
    document.getElementById('ansicht-karte').classList.toggle('versteckt', !!istAutomat);
    document.getElementById('ansicht-automat').classList.toggle('versteckt', !istAutomat);
    allesNeuZeichnen();
    window.scrollTo(0, 0);
    if (!istAutomat) setTimeout(karteEinpassen, 0);
  }

  function allesNeuZeichnen() {
    filterZeichnen();
    if (aktuellerAutomat) automatZeichnen();
    else { listeZeichnen(); karteAktualisieren(); }
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('pickd-update', allesNeuZeichnen); // z.B. Betreiber hat nachgefüllt

  karteStarten();
  route();
})();
