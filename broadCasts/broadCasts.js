// broadCasts.js - unified, cleaned, and feature-complete
document.addEventListener('DOMContentLoaded', () => {
  // ---- DOM elements ----
  const uploadModal = document.getElementById('uploadModal');
  const uploadBtn = document.getElementById('uploadBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  const chooseImgBtn = document.getElementById('chooseImgBtn');
  const bannerImageInput = document.getElementById('bannerImageInput');
  const previewImg = document.getElementById('previewImg');

  const bannersGrid = document.getElementById('bannersGrid');
  const saveBtn = document.getElementById('saveBannerBtn');

  // state for editing
  let isEditing = false;
  let editingCard = null;

  // ---- helpers ----
  function escapeHtml(s) {
    return String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  }

  // create a card element from data
  function createBannerCard({ id, img, title, desc, link = '', date }) {
    const card = document.createElement('article');
    card.className = 'banner-card';
    if (id) card.dataset.id = id;

    card.innerHTML = `
      <div class="banner-media"><img src="${escapeHtml(img)}" alt="${escapeHtml(title)}"></div>
      <div class="banner-body">
        <h3 class="title">${escapeHtml(title)}</h3>
        <p class="desc">${escapeHtml(desc)}</p>
        ${link ? `<a class="link" href="${escapeHtml(link)}" target="_blank">${escapeHtml(link)}</a>` : ''}
        <div class="meta">Created: ${escapeHtml(date)}</div>
      </div>
      <div class="banner-actions">
        <button class="link-btn edit">Edit</button>
        <button class="link-btn disable">Disable</button>
        <button class="link-btn del">Delete</button>
      </div>
    `;
    attachCardHandlers(card);
    return card;
  }

  // attach handlers for edit/disable/delete on a card
  function attachCardHandlers(card) {
    if (!card) return;
    const edit = card.querySelector('.edit');
    const disable = card.querySelector('.disable');
    const del = card.querySelector('.del');

    if (edit) edit.addEventListener('click', () => openEditModal(card));
    if (disable) disable.addEventListener('click', () => {
      card.classList.add('inactive');
    });
    if (del) del.addEventListener('click', () => {
      if (confirm('Delete this banner?')) card.remove();
    });
  }

  // initialize handlers for existing cards on page
  document.querySelectorAll('.banner-card').forEach(attachCardHandlers);

  // ---- modal open/close ----
  function openUploadModal() {
    isEditing = false;
    editingCard = null;
    document.getElementById('bannerTitle').value = '';
    document.getElementById('bannerDesc').value = '';
    document.getElementById('bannerURL').value = '';
    bannerImageInput.value = '';
    previewImg.src = '';
    previewImg.style.display = 'none';
    uploadModal.style.display = 'flex';
  }

  function openEditModal(card) {
    if (!card) return;
    isEditing = true;
    editingCard = card;

    const title = card.querySelector('.title')?.innerText || '';
    const desc = card.querySelector('.desc')?.innerText || '';
    const link = card.querySelector('.link')?.getAttribute('href') || '';
    const imgEl = card.querySelector('.banner-media img');
    const imgSrc = imgEl ? imgEl.src : '';

    document.getElementById('bannerTitle').value = title;
    document.getElementById('bannerDesc').value = desc;
    document.getElementById('bannerURL').value = link || '';

    if (imgSrc) {
      previewImg.src = imgSrc;
      previewImg.style.display = 'block';
    } else {
      previewImg.src = '';
      previewImg.style.display = 'none';
    }

    // clear file input so we can detect new file selection
    bannerImageInput.value = '';
    uploadModal.style.display = 'flex';
  }

  function closeModal() {
    uploadModal.style.display = 'none';
  }

  // ---- event wiring ----
  uploadBtn.addEventListener('click', openUploadModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // choose image button -> open file picker
  chooseImgBtn.addEventListener('click', () => bannerImageInput.click());

  // when file chosen -> show preview
  bannerImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgURL = URL.createObjectURL(file);
    previewImg.src = imgURL;
    previewImg.style.display = 'block';
  });

  // ---- save logic: create or update ----
  saveBtn.addEventListener('click', () => {
    const title = document.getElementById('bannerTitle').value.trim();
    const desc = document.getElementById('bannerDesc').value.trim();
    const url = document.getElementById('bannerURL').value.trim();
    const file = bannerImageInput.files[0];

    if (!title) { alert('Please enter a title.'); return; }
    // When creating new banner, require image. When editing, image optional.
    if (!isEditing && !file) { alert('Please choose an image.'); return; }

    // helper to update card DOM
    function updateCardDOM(card, imgURL) {
      if (imgURL) {
        let img = card.querySelector('.banner-media img');
        if (!img) {
          const media = document.createElement('div');
          media.className = 'banner-media';
          media.innerHTML = `<img src="${imgURL}" alt="${escapeHtml(title)}" />`;
          card.insertBefore(media, card.firstChild);
        } else {
          img.src = imgURL;
        }
      }

      const titleEl = card.querySelector('.title');
      const descEl = card.querySelector('.desc');
      const linkEl = card.querySelector('.link');
      const metaEl = card.querySelector('.meta');

      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      if (linkEl) {
        if (url) { linkEl.href = url; linkEl.textContent = url; }
        else linkEl.remove();
      } else if (url) {
        const meta = card.querySelector('.meta');
        const a = document.createElement('a');
        a.className = 'link';
        a.href = url;
        a.target = '_blank';
        a.textContent = url;
        meta.parentNode.insertBefore(a, meta);
      }
      if (metaEl) metaEl.textContent = `Created: ${new Date().toISOString().slice(0,10)}`;
    }

    // If a new file is selected, use it (preview URL). Otherwise preserve existing image.
    if (file) {
      const imgURL = URL.createObjectURL(file);
      if (isEditing && editingCard) {
        updateCardDOM(editingCard, imgURL);
        closeModal();
      } else {
        // create new card
        const card = createBannerCard({
          id: 'new',
          img: imgURL,
          title,
          desc,
          link: url,
          date: new Date().toISOString().slice(0,10)
        });
        bannersGrid.prepend(card);
        closeModal();
      }
    } else {
      // no new file selected
      if (isEditing && editingCard) {
        updateCardDOM(editingCard, null);
        closeModal();
      } else {
        alert('Please choose an image.');
        return;
      }
    }

    // reset form & state
    document.getElementById('bannerTitle').value = '';
    document.getElementById('bannerDesc').value = '';
    document.getElementById('bannerURL').value = '';
    bannerImageInput.value = '';
    previewImg.src = '';
    previewImg.style.display = 'none';
    isEditing = false;
    editingCard = null;
  });

  // Prevent memory leaks: revoke object URLs when card images are removed (optional improvement)
  bannersGrid.addEventListener('click', (e) => {
    const del = e.target.closest('.del');
    if (!del) return;
    const card = del.closest('.banner-card');
    const img = card?.querySelector('.banner-media img');
    if (img && img.src && img.src.startsWith('blob:')) {
      URL.revokeObjectURL(img.src);
    }
  });
});
