// fleet.js - modal open/close (keeps fleet.html background unchanged)

// helper to set text safely
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

document.addEventListener('DOMContentLoaded', () => {
  const rowsContainer = document.getElementById('fleet-rows');
  const modalOverlay = document.getElementById('busModal');
  const modalClose = document.getElementById('modalClose');

  // Open modal when click View button (no navigation)
  rowsContainer.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.btn-view');
    if (!btn) return;

    // read data from the row or data-bus attribute
    const row = btn.closest('.row');
    const busNumber = btn.dataset.bus || (row && row.querySelector('.col-number')?.innerText) || 'Unknown Bus';
    const conductor = row && row.querySelector('.col-conductor')?.innerText || '—';
    const hours = row && row.querySelector('.col-hours')?.innerText || '—';

    // populate modal fields (you can expand this to fetch real data)
    setText('modalTitle', `Bus Details — ${busNumber}`);
    setText('mBusNumber', busNumber);
    setText('mConductor', conductor);
    setText('mPassword', '••••••••'); // placeholder
    setText('r1Title', 'Jalandhar ⇄ Kapurthala');
    setText('r2Title', 'Kapurthala ⇄ Jalandhar');

    // static example lists — replace with DB fetch later if needed
    const fillList = (elId, items) => {
      const ul = document.getElementById(elId);
      if (!ul) return;
      ul.innerHTML = '';
      items.forEach(i => {
        const li = document.createElement('li');
        li.textContent = i;
        ul.appendChild(li);
      });
    };

    fillList('r1Stops', ['Jalandhar Chowk','Science City','KPTU','Kapurthala']);
    fillList('r1Times', ['09:00 AM - 09:30 AM','10:00 AM - 10:30 AM','02:00 PM - 02:30 PM']);
    fillList('r2Stops', ['Kapurthala Chowk','Football Chowk','Jalandhar Chowk']);
    fillList('r2Times', ['11:00 AM - 11:30 AM','01:00 PM - 01:30 PM','03:30 PM - 04:00 PM']);

    setText('conName', 'Daksh Wadhwa');
    setText('conPhone', '88727-35981');
    setText('drvName', 'Rahul');
    setText('drvPhone', '88727-35981');

    // show modal without changing background
    modalOverlay.classList.add('active');
    // ensure modal has focus for accessibility
    const firstFocusable = modalOverlay.querySelector('.modal-close');
    if (firstFocusable) firstFocusable.focus();
  });

  // close modal on X
  modalClose.addEventListener('click', () => {
    document.getElementById('busModal').classList.remove('active');
  });

  // close modal if user presses Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modalOverlay.classList.remove('active');
  });
});
