/* fleet.js - minimal, well-commented */

/* helper setText */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

document.addEventListener('DOMContentLoaded', () => {
  const rowsContainer = document.getElementById('fleet-rows');
  const hover = document.getElementById('busHoverCard');
  const hoverClose = document.getElementById('hoverClose');
  const search = document.querySelector('.search');

  /* ---- search filter (simple text filter) ---- */
  if (search) {
    search.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      const rows = rowsContainer.querySelectorAll('.row');
      rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  /* ---- position hover card near anchor (smart) ---- */
  function positionCard(anchorEl) {
    const card = hover;
    const pad = 12;
    const rect = anchorEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // preferred to the right of the button
    let left = rect.right + 12;
    if (left + card.offsetWidth + pad > vw) {
      // not enough space at right -> position on left
      left = rect.left - card.offsetWidth - 12;
      if (left < 8) left = Math.max(8, (vw - card.offsetWidth) / 2);
    }

    let top = rect.top;
    if (top + card.offsetHeight + pad > vh) {
      top = Math.max(8, vh - card.offsetHeight - 12);
    }

    card.style.left = `${Math.round(left)}px`;
    card.style.top = `${Math.round(top)}px`;
  }

  /* ---- show card with data from row ---- */
  rowsContainer.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.btn-view');
    if (!btn) return;

    const row = btn.closest('.row');
    const busNo = btn.dataset.bus || (row && row.querySelector('.col-number')?.innerText) || 'Unknown';
    const routes = row && row.querySelector('.col-routes')?.innerText || '—';
    const conductor = row && row.querySelector('.col-conductor')?.innerText || '—';
    const conName = row && row.dataset.conductorName || '—';
    const conPhone = row && row.dataset.conductorPhone || '—';
    const drvName = row && row.dataset.driverName || '—';
    const drvPhone = row && row.dataset.driverPhone || '—';

    // populate fields
    setText('hcBusNumber', `Bus: ${busNo}`);
    setText('hcBusNo', busNo);
    setText('hcRoutes', routes);
    setText('hcConductor', `Conductor: ${conductor}`);
    setText('hcConName', conName);
    setText('hcConPhone', conPhone);
    setText('hcDrvName', drvName);
    setText('hcDrvPhone', drvPhone);

    // example stops/times — replace with real fetch later
    const fillList = (elId, items) => {
      const ul = document.getElementById(elId);
      if (!ul) return;
      ul.innerHTML = '';
      items.forEach(it => {
        const li = document.createElement('li');
        li.textContent = it;
        ul.appendChild(li);
      });
    };
    fillList('r1Stops', ['Jalandhar Chowk','Science City','KPTU','Kapurthala']);
    fillList('r1Times', ['09:00 - 09:30','10:00 - 10:30','14:00 - 14:30']);

    // show and position hover card
    hover.classList.remove('hide');
    hover.classList.add('show');
    hover.style.display = 'block';
    // small timeout so we have card dimensions
    setTimeout(() => positionCard(btn), 6);
  });

  /* ---- close behaviors ---- */
  hoverClose.addEventListener('click', () => {
    hover.classList.remove('show');
    hover.classList.add('hide');
    setTimeout(() => { hover.style.display = 'none'; }, 150);
  });

  document.addEventListener('click', (e) => {
    if (!hover.classList.contains('show')) return;
    if (e.target.closest('#busHoverCard')) return; // clicked inside card
    if (e.target.closest('.btn-view')) return; // clicked a different view button
    hover.classList.remove('show');
    hover.classList.add('hide');
    setTimeout(() => { hover.style.display = 'none'; }, 150);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hover.classList.contains('show')) {
      hover.classList.remove('show');
      hover.classList.add('hide');
      setTimeout(() => { hover.style.display = 'none'; }, 150);
    }
  });

  // maintain visibility after resize (reposition)
  window.addEventListener('resize', () => {
    if (hover.classList.contains('show')) {
      // if visible, keep it on screen; we simply hide then show to recalc
      hover.style.display = 'block';
    }
  });
});
