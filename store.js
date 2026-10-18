/* =========================================================
   PICKD – Datenspeicher & Simulation
   Es gibt noch keine echten Automaten. Darum werden Bestand und
   Verkäufe hier simuliert und im Browser (localStorage) gespeichert.
   Kunden-Seite und Betreiber-Bereich teilen sich diese Daten.
   Später kann man genau diese Datei gegen eine echte Datenbank /
   Automaten-Schnittstelle austauschen – der Rest bleibt gleich.
   ========================================================= */
(function () {
  const CFG = window.PICKD_CONFIG;
  const PRODUKTE = window.PICKD_PRODUKTE;
  const AUTOMATEN = window.PICKD_AUTOMATEN;
  const SPEICHER_KEY = 'pickd-daten-v1';

  /* Verhalten je Standorttyp für die Simulation */
  const PROFILE = {
    schule: {
      proTag: 28, wochenende: [0, 0], stunden: { 7: 2, 8: 3, 9: 6, 10: 8, 11: 3, 12: 7, 13: 5, 14: 2, 15: 2, 16: 1 },
      kategorie: { Riegel: 1.2, Snack: 1.3, Getränk: 1.1, Gekühlt: 0.6 }, proteinBonus: 1
    },
    gym: {
      proTag: 22, wochenende: [1.1, 0.9], stunden: { 6: 1, 7: 2, 8: 1, 9: 1, 10: 1, 11: 1, 12: 2, 13: 1, 14: 1, 15: 2, 16: 3, 17: 5, 18: 6, 19: 5, 20: 3, 21: 1 },
      kategorie: { Riegel: 1.6, Snack: 0.5, Getränk: 1.1, Gekühlt: 1.4 }, proteinBonus: 1.6
    },
    bahnhof: {
      proTag: 42, wochenende: [0.8, 0.7], stunden: { 5: 1, 6: 3, 7: 6, 8: 4, 9: 2, 10: 2, 11: 2, 12: 3, 13: 2, 14: 2, 15: 3, 16: 5, 17: 6, 18: 4, 19: 2, 20: 2, 21: 1, 22: 1 },
      kategorie: { Riegel: 1, Snack: 1, Getränk: 1.5, Gekühlt: 1.2 }, proteinBonus: 1
    },
    einkaufszentrum: {
      proTag: 30, wochenende: [1.4, 0], stunden: { 9: 2, 10: 3, 11: 4, 12: 5, 13: 4, 14: 3, 15: 4, 16: 5, 17: 5, 18: 4, 19: 2 },
      kategorie: { Riegel: 1, Snack: 1.1, Getränk: 1.2, Gekühlt: 1.1 }, proteinBonus: 1
    }
  };

  /* Zufallszahlen mit festem Startwert -> jedes Mal gleiche Demo-Daten */
  function zufall(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gewichtetWaehlen(rnd, eintraege) {
    const summe = eintraege.reduce((s, e) => s + e[1], 0);
    let r = rnd() * summe;
    for (const e of eintraege) { r -= e[1]; if (r <= 0) return e[0]; }
    return eintraege[eintraege.length - 1][0];
  }

  /* Ändert sich data.js (neues Produkt / neuer Automat), wird neu simuliert */
  function datenSignatur() {
    return JSON.stringify([CFG.kapazitaetProFach, CFG.simulationTage,
      PRODUKTE.map(p => p.id), AUTOMATEN.map(a => [a.id, a.sortiment])]);
  }

  function istHighProtein(p) {
    const n = p.naehrwerte;
    return n.kcal > 0 && (n.eiweiss * 4) / n.kcal >= CFG.highProteinAnteil;
  }

  function simuliereVerkaeufe(sortimente) {
    const rnd = zufall(2026);
    const verkaeufe = [];
    const jetzt = new Date();
    for (let t = CFG.simulationTage; t >= 0; t--) {
      const tag = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() - t);
      const wochentag = tag.getDay(); // 0 = Sonntag, 6 = Samstag
      AUTOMATEN.forEach(a => {
        const prof = PROFILE[a.typ];
        let faktor = 1;
        if (wochentag === 6) faktor = prof.wochenende[0];
        if (wochentag === 0) faktor = prof.wochenende[1];
        const anzahl = Math.round(prof.proTag * faktor * (0.75 + rnd() * 0.5));
        const produkte = sortimente[a.id].map(id => {
          const p = PRODUKTE.find(x => x.id === id);
          let g = prof.kategorie[p.kategorie] || 1;
          if (istHighProtein(p)) g *= prof.proteinBonus;
          if (p.id.startsWith('voeslauer')) g *= 1.3;
          return [id, g * (0.6 + rnd() * 0.8)];
        });
        const stunden = Object.entries(prof.stunden).map(([h, g]) => [Number(h), g]);
        for (let i = 0; i < anzahl; i++) {
          const h = gewichtetWaehlen(rnd, stunden);
          const zeit = new Date(tag.getFullYear(), tag.getMonth(), tag.getDate(), h, Math.floor(rnd() * 60));
          if (zeit > jetzt) continue; // heute nur bis jetzt
          verkaeufe.push([zeit.getTime(), a.id, gewichtetWaehlen(rnd, produkte)]);
        }
      });
    }
    return verkaeufe.sort((x, y) => x[0] - y[0]);
  }

  function simuliereBestand(sortimente) {
    const rnd = zufall(77);
    const kap = CFG.kapazitaetProFach;
    const bestand = {};
    AUTOMATEN.forEach(a => {
      bestand[a.id] = {};
      sortimente[a.id].forEach(id => {
        const r = rnd();
        let n;
        if (r < 0.08) n = 0;                                            // ausverkauft
        else if (r < 0.28) n = 1 + Math.floor(rnd() * (CFG.fastLeerGrenze - 1)); // fast leer
        else n = CFG.fastLeerGrenze + Math.floor(rnd() * (kap - CFG.fastLeerGrenze + 1));
        bestand[a.id][id] = n;
      });
    });
    return bestand;
  }

  function startWuensche() {
    const t = Date.now();
    return [
      { id: 'w1', automat: 'hak', text: 'Barebells Riegel', likes: 14, zeit: t - 864e5 * 3 },
      { id: 'w2', automat: 'hak', text: 'Eistee zuckerfrei', likes: 9, zeit: t - 864e5 * 5 },
      { id: 'w3', automat: 'htl', text: 'Protein-Pudding', likes: 6, zeit: t - 864e5 * 2 },
      { id: 'w4', automat: 'speedfit', text: 'Proteinshake Schoko (gekühlt)', likes: 21, zeit: t - 864e5 * 4 },
      { id: 'w5', automat: 'speedfit', text: 'Bananen', likes: 5, zeit: t - 864e5 * 1 },
      { id: 'w6', automat: 'hbf', text: 'Kaffee to go', likes: 17, zeit: t - 864e5 * 6 },
      { id: 'w7', automat: 'ekz-sued', text: 'Veganes Wrap', likes: 4, zeit: t - 864e5 * 2 }
    ];
  }

  function neueDaten() {
    const sortimente = {};
    AUTOMATEN.forEach(a => { sortimente[a.id] = a.sortiment.slice(); });
    return {
      signatur: datenSignatur(),
      sortimente,
      preise: {},                       // geänderte Verkaufspreise { produktId: preis }
      bestand: simuliereBestand(sortimente),
      verkaeufe: simuliereVerkaeufe(sortimente),
      wuensche: startWuensche(),
      meineLikes: []
    };
  }

  /* ---------- Laden & Speichern ---------- */
  let daten = null;
  function laden() {
    try {
      const roh = localStorage.getItem(SPEICHER_KEY);
      if (roh) {
        const d = JSON.parse(roh);
        if (d.signatur === datenSignatur()) { daten = d; return; }
        // Daten geändert: neu simulieren, aber Wünsche behalten
        daten = neueDaten();
        daten.wuensche = d.wuensche || daten.wuensche;
        daten.meineLikes = d.meineLikes || [];
        speichern();
        return;
      }
    } catch (e) { /* Speicher nicht verfügbar -> nur im Arbeitsspeicher */ }
    daten = neueDaten();
    speichern();
  }
  function speichern() {
    try { localStorage.setItem(SPEICHER_KEY, JSON.stringify(daten)); } catch (e) { }
    window.dispatchEvent(new Event('pickd-update'));
  }
  // Änderungen aus einem anderen Tab (z.B. Betreiber füllt nach) übernehmen
  window.addEventListener('storage', e => {
    if (e.key === SPEICHER_KEY && e.newValue) {
      try { daten = JSON.parse(e.newValue); window.dispatchEvent(new Event('pickd-update')); } catch (err) { }
    }
  });

  /* ---------- Öffentliche Funktionen ---------- */
  const Store = {
    config: CFG,
    typen: window.PICKD_TYPEN,

    produkt(id) {
      const p = PRODUKTE.find(x => x.id === id);
      if (!p) return null;
      const preis = daten.preise[id] != null ? daten.preise[id] : p.preis;
      return Object.assign({}, p, { preis, originalPreis: p.preis });
    },
    alleProdukte() { return PRODUKTE.map(p => Store.produkt(p.id)); },
    automat(id) { return AUTOMATEN.find(a => a.id === id) || null; },
    alleAutomaten() { return AUTOMATEN.slice(); },
    sortiment(automatId) { return (daten.sortimente[automatId] || []).slice(); },

    bestand(automatId, produktId) {
      const b = daten.bestand[automatId] || {};
      return b[produktId] || 0;
    },
    status(anzahl) {
      if (anzahl <= 0) return 'leer';
      if (anzahl < CFG.fastLeerGrenze) return 'fast';
      return 'ok';
    },
    statusText(status) {
      return { ok: 'Verfügbar', fast: 'Fast leer', leer: 'Ausverkauft' }[status];
    },

    /* Labels werden aus den Nährwerten berechnet */
    labels(p) {
      const l = [];
      if (istHighProtein(p)) l.push({ key: 'protein', text: 'High Protein' });
      if (p.naehrwerte.zucker <= CFG.zuckerfreiMax) l.push({ key: 'zuckerfrei', text: 'Zuckerfrei' });
      if (p.vegan) l.push({ key: 'vegan', text: 'Vegan' });
      if (p.gekuehlt) l.push({ key: 'gekuehlt', text: 'Gekühlt' });
      return l;
    },
    passtZuFiltern(p, filter) {
      if (!filter.length) return true;
      const keys = Store.labels(p).map(l => l.key);
      return filter.every(f => keys.includes(f));
    },

    /* Produktwünsche */
    wuensche(automatId) {
      return daten.wuensche.filter(w => !automatId || w.automat === automatId)
        .sort((a, b) => b.likes - a.likes || b.zeit - a.zeit);
    },
    wunschHinzufuegen(automatId, text) {
      text = text.trim().slice(0, 60);
      if (!text) return false;
      const vorhanden = daten.wuensche.find(w => w.automat === automatId && w.text.toLowerCase() === text.toLowerCase());
      if (vorhanden) { Store.wunschLiken(vorhanden.id); return true; }
      const id = 'w' + Date.now();
      daten.wuensche.push({ id, automat: automatId, text, likes: 1, zeit: Date.now() });
      daten.meineLikes.push(id);
      speichern();
      return true;
    },
    wunschLiken(id) {
      const w = daten.wuensche.find(x => x.id === id);
      if (!w) return;
      const i = daten.meineLikes.indexOf(id);
      if (i >= 0) { daten.meineLikes.splice(i, 1); w.likes = Math.max(0, w.likes - 1); }
      else { daten.meineLikes.push(id); w.likes++; }
      speichern();
    },
    wunschGeliked(id) { return daten.meineLikes.includes(id); },
    wunschLoeschen(id) {
      daten.wuensche = daten.wuensche.filter(w => w.id !== id);
      speichern();
    },

    /* Verkäufe: Liste von [zeitstempel, automatId, produktId] */
    verkaeufe(vonZeit, bisZeit, automatId) {
      return daten.verkaeufe.filter(v => v[0] >= vonZeit && (bisZeit == null || v[0] < bisZeit) && (!automatId || v[1] === automatId));
    },

    /* Betreiber-Aktionen */
    nachfuellen(automatId) {
      Store.sortiment(automatId).forEach(id => { daten.bestand[automatId][id] = CFG.kapazitaetProFach; });
      speichern();
    },
    allesNachfuellen() {
      AUTOMATEN.forEach(a => Store.sortiment(a.id).forEach(id => { daten.bestand[a.id][id] = CFG.kapazitaetProFach; }));
      speichern();
    },
    verkaufSimulieren() {
      const moeglich = [];
      AUTOMATEN.forEach(a => Store.sortiment(a.id).forEach(id => {
        if (Store.bestand(a.id, id) > 0) moeglich.push([a.id, id]);
      }));
      if (!moeglich.length) return null;
      const [aId, pId] = moeglich[Math.floor(Math.random() * moeglich.length)];
      daten.bestand[aId][pId]--;
      daten.verkaeufe.push([Date.now(), aId, pId]);
      speichern();
      return { automat: Store.automat(aId), produkt: Store.produkt(pId) };
    },
    preisSetzen(produktId, preis) {
      const p = PRODUKTE.find(x => x.id === produktId);
      if (!p || !(preis > 0)) return;
      if (Math.abs(preis - p.preis) < 0.001) delete daten.preise[produktId];
      else daten.preise[produktId] = Math.round(preis * 100) / 100;
      speichern();
    },
    sortimentUmschalten(automatId, produktId) {
      const s = daten.sortimente[automatId];
      const i = s.indexOf(produktId);
      if (i >= 0) s.splice(i, 1);
      else { s.push(produktId); daten.bestand[automatId][produktId] = 0; } // neues Fach ist leer -> nachfüllen
      speichern();
    },
    zuruecksetzen() {
      daten = neueDaten();
      speichern();
    },

    /* Hilfsfunktionen für die Anzeige */
    euro(betrag) {
      return betrag.toLocaleString('de-AT', { style: 'currency', currency: 'EUR' });
    },
    zahl(wert, stellen) {
      return wert.toLocaleString('de-AT', { maximumFractionDigits: stellen == null ? 1 : stellen });
    },
    gewinnProStueck(p) {
      return p.preis / (1 + p.ust) - p.einkauf;
    }
  };

  laden();
  window.PICKD = Store;
})();
