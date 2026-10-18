/* =========================================================
   PICKD – Bausteine, die Kunden- und Betreiberseite teilen
   ========================================================= */
(function () {
  const S = window.PICKD;

  /* Text sicher in HTML einsetzen (wichtig für Nutzereingaben) */
  S.esc = function (text) {
    return String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  };

  /* Logo, Name und Slogan aus config.js in die Kopfzeile setzen */
  S.kopfEinrichten = function () {
    document.querySelectorAll('[data-logo]').forEach(img => { img.src = S.config.logo; img.alt = S.config.firmenname + ' Logo'; });
    // Schriftzug wie im Logo: letzter Buchstabe + Punkt in der Akzentfarbe ("PICKD.")
    const name = S.config.firmenname;
    document.querySelectorAll('[data-firmenname]').forEach(el => {
      el.innerHTML = S.esc(name.slice(0, -1)) + `<span class="marke-akzent">${S.esc(name.slice(-1))}.</span>`;
      if (!S.config.nameNebenLogo) el.classList.add('versteckt');
    });
    document.querySelectorAll('[data-slogan]').forEach(el => { el.textContent = S.config.slogan; });
    document.title = document.title.replace('PICKD', S.config.firmenname);
  };

  /* Produktbild: falls in data.js ein "bild" eingetragen ist, wird es
     verwendet, sonst das Emoji als Platzhalter */
  S.produktBild = function (p) {
    return p.bild
      ? `<div class="produkt-bild"><img src="${S.esc(p.bild)}" alt=""></div>`
      : `<div class="produkt-bild" aria-hidden="true">${p.emoji || '🛒'}</div>`;
  };

  S.labelsHtml = function (p) {
    return `<div class="labels">${S.labels(p).map(l => `<span class="label ${l.key}">${l.text}</span>`).join('')}</div>`;
  };

  S.statusHtml = function (anzahl) {
    const st = S.status(anzahl);
    return `<span class="status ${st}">${S.statusText(st)}</span>`;
  };

  S.portionText = function (p) {
    return p.einheit === 'ml' ? S.zahl(p.portion / 1000, 2) + ' l' : p.portion + ' g';
  };

  S.FILTER = [
    { key: 'protein', text: 'High Protein', emoji: '💪' },
    { key: 'zuckerfrei', text: 'Zuckerfrei', emoji: '🚫🍬' },
    { key: 'vegan', text: 'Vegan', emoji: '🌱' },
    { key: 'gekuehlt', text: 'Gekühlt', emoji: '❄️' }
  ];
})();
