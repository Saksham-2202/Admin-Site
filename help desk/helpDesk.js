// help-desk.js - minimal logic: search, filter, modal details

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('complaintsBody');
  const rows = Array.from(tbody.querySelectorAll('.complaint-row'));
  const countEl = document.getElementById('count');
  const shownCount = document.getElementById('shownCount');
  const totalCount = document.getElementById('totalCount');

  // filters & search
  const searchInput = document.querySelector('.search-complaints');
  const statusFilter = document.querySelector('.status-filter');
  const priorityFilter = document.querySelector('.priority-filter');
  const categoryFilter = document.querySelector('.category-filter');
  const sourceFilter = document.querySelector('.source-filter');

  function updateCounts(visibleRows) {
    const n = visibleRows.length;
    if (countEl) countEl.textContent = n;
    if (shownCount) shownCount.textContent = Math.min(n, rows.length);
    if (totalCount) totalCount.textContent = rows.length;
  }

  function matchesFilters(row) {
    const q = (searchInput.value || '').trim().toLowerCase();
    const status = (statusFilter.value || 'all');
    const pr = (priorityFilter.value || 'all');
    const cat = (categoryFilter.value || 'all');
    const src = (sourceFilter.value || 'all');

    // text search across row text
    const text = row.innerText.toLowerCase();
    if (q && !text.includes(q)) return false;

    // dataset filters (status/priority/source)
    if (status !== 'all' && row.dataset.status !== status) return false;
    if (pr !== 'all' && row.dataset.priority !== pr) return false;
    if (src !== 'all' && row.dataset.source !== src) return false;

    // category: check text content of category cell
    if (cat !== 'all') {
      const catCell = row.querySelector('td:nth-child(4)');
      if (!catCell || !catCell.innerText.toLowerCase().includes(cat.toLowerCase())) return false;
    }
    return true;
  }

  function applyFilters() {
    const visible = [];
    rows.forEach(r => {
      if (matchesFilters(r)) {
        r.style.display = '';
        visible.push(r);
      } else {
        r.style.display = 'none';
      }
    });
    updateCounts(visible);
  }

  // attach filter/search listeners
  [searchInput, statusFilter, priorityFilter, categoryFilter, sourceFilter].forEach(el => {
    if (!el) return;
    el.addEventListener('input', applyFilters);
    el.addEventListener('change', applyFilters);
  });

  // initial counts
  updateCounts(rows);

  /* --------------------- details modal --------------------- */

const detailPanel = document.getElementById('detailPanel');
const detailCloseBtn = document.getElementById('detailClose');
const detailIdEl = document.getElementById('detailId');
const detailDateEl = document.getElementById('detailDate');
const detailSourceEl = document.getElementById('detailSource');
const detailCategoryEl = document.getElementById('detailCategory');
const detailRouteEl = document.getElementById('detailRoute');
const detailEmailEl = document.getElementById('detailEmail');
const detailTextEl = document.getElementById('detailText');
const dpStatusBadge = document.getElementById('dpStatusBadge');
const dpPriorityBadge = document.getElementById('dpPriorityBadge');
const activityListEl = document.getElementById('activityList');
const replyText = document.getElementById('replyText');
const sendReplyBtn = document.getElementById('sendReply');
const changeStatusSel = document.getElementById('changeStatus');
const updateStatusBtn = document.getElementById('updateStatus');
const markSolvedBtn = document.getElementById('markSolved');

// open detail panel and populate fields from row
function openDetailPanel(row) {
  const id = row.dataset.id || row.querySelector('.cid')?.innerText || '—';
  const date = row.children[1].innerText;
  const srcText = row.children[2].innerText.trim();
  const category = row.children[3].innerText;
  const route = row.children[4].innerText;
  const priority = row.dataset.priority || 'low';
  const status = row.dataset.status || 'open';

  // populate UI
  detailIdEl.textContent = `Complaint ${id}`;
  detailDateEl.textContent = date;
  detailSourceEl.innerHTML = srcText; // includes name + small label
  detailCategoryEl.textContent = category;
  detailRouteEl.textContent = route;
  // email placeholder - if you have email in dataset use it:
  detailEmailEl.textContent = row.dataset.email || '';

  detailTextEl.textContent = row.dataset.description || 'No detailed description available.';

  // badges
  dpStatusBadge.className = 'status-pill';
  if (status === 'open') { dpStatusBadge.classList.add('status-open'); dpStatusBadge.textContent = 'Open'; }
  else if (status === 'pending') { dpStatusBadge.classList.add('status-pending'); dpStatusBadge.textContent = 'Pending'; }
  else { dpStatusBadge.classList.add('status-solved'); dpStatusBadge.textContent = 'Solved'; }

  dpPriorityBadge.className = 'priority-pill';
  if (priority === 'high') { dpPriorityBadge.classList.add('badge-high'); dpPriorityBadge.textContent = 'High Priority'; }
  else if (priority === 'medium') { dpPriorityBadge.classList.add('badge-medium'); dpPriorityBadge.textContent = 'Medium Priority'; }
  else { dpPriorityBadge.classList.add('badge-low'); dpPriorityBadge.textContent = 'Low Priority'; }

  // activity list - if your row has activity data use it otherwise default examples
  activityListEl.innerHTML = '';
  const activities = JSON.parse(row.dataset.activity || '["Complaint submitted • 2023-10-27 14:32","Assigned to Admin Team • 2023-10-27 15:00"]');
  activities.forEach((act, i) => {
    const li = document.createElement('li');
    const dot = document.createElement('span');
    dot.className = 'dot ' + (i === 0 ? 'blue' : 'green');
    li.appendChild(dot);
    const txt = document.createElement('span');
    txt.innerHTML = act;
    li.appendChild(txt);
    activityListEl.appendChild(li);
  });

  // set select to current status
  changeStatusSel.value = status;

  // show panel
  detailPanel.style.display = 'block';
  detailPanel.setAttribute('aria-hidden', 'false');
}

// close
detailCloseBtn.addEventListener('click', () => {
  detailPanel.style.display = 'none';
  detailPanel.setAttribute('aria-hidden', 'true');
});

// clicking any complaint row opens panel (reuse earlier event binding)
tbody.addEventListener('click', (ev) => {
  const row = ev.target.closest('.complaint-row');
  if (!row) return;
  openDetailPanel(row);
});

// send reply (placeholder)
sendReplyBtn.addEventListener('click', () => {
  const txt = replyText.value.trim();
  if (!txt) return alert('Type a reply first.');
  // TODO: send reply to backend
  alert('Reply sent (demo): ' + txt);
  replyText.value = '';
});

// update status placeholder
updateStatusBtn.addEventListener('click', () => {
  const newStatus = changeStatusSel.value;
  // TODO: update backend
  alert('Status updated to: ' + newStatus);
  detailPanel.style.display = 'none';
});

// mark as solved
markSolvedBtn.addEventListener('click', () => {
  // TODO: update backend and UI
  alert('Marked as solved (demo).');
  detailPanel.style.display = 'none';
});

// close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && detailPanel.style.display === 'block') {
    detailPanel.style.display = 'none';
  }
});


  // small pager (non-functional demo)
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  if (prevPage) prevPage.addEventListener('click', () => alert('Previous page (implement server-side pagination)'));
  if (nextPage) nextPage.addEventListener('click', () => alert('Next page (implement server-side pagination)'));
});
