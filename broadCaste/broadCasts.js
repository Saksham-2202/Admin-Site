/* broadcasts.js - minimal interactions for the banners page */

document.addEventListener('DOMContentLoaded', () => {
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadInput = document.getElementById('uploadInput');
  const bannersGrid = document.getElementById('bannersGrid');

  // Utility to create a banner DOM node (same structure used in HTML)
  function createBannerCard({ id, img, title, desc, link = '', date }) {
    const card = document.createElement('article');
    card.className = 'banner-card';
    card.dataset.id = id;

    card.innerHTML = `
      <div class="banner-media"><img src="${img}" alt="${title}"></div>
      <div class="banner-body">
        <h3 class="title">${escapeHtml(title)}</h3>
        <p class="desc">${escapeHtml(desc)}</p>
        ${link ? `<a class="link" href="${escapeHtml(link)}" target="_blank">${escapeHtml(link)}</a>` : ''}
        <div class="meta">Created: ${escapeHtml(date)}</div>
      </div>
      <div class="banner-actions">
        <button class="link-btn edit">Edit</button>
        <button class="link-btn disable">Disable</button>
        <button class="link-btn del">🗑</button>
      </div>
    `;
    attachCardHandlers(card);
    return card;
  }

  // attach event handlers for buttons inside a card
  function attachCardHandlers(card) {
    const edit = card.querySelector('.edit');
    const disable = card.querySelector('.disable');
    const enable = card.querySelector('.enable');
    const del = card.querySelector('.del');

    if (edit) edit.addEventListener('click', () => alert('Edit banner (implement edit form)'));
    if (disable) disable.addEventListener('click', () => {
      card.classList.add('inactive');
      alert('Banner disabled (demo)');
    });
    if (enable) enable.addEventListener('click', () => {
      card.classList.remove('inactive');
      alert('Banner enabled (demo)');
    });
    if (del) del.addEventListener('click', () => {
      if (confirm('Delete this banner?')) card.remove();
    });
  }

  // attach handlers to initial cards on page
  document.querySelectorAll('.banner-card').forEach(attachCardHandlers);

  // small helper to escape text
  function escapeHtml(s) {
    return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  }
});
// Modal elements
const uploadModal = document.getElementById("uploadModal");
const uploadBtn = document.getElementById("uploadBtn");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Open modal
uploadBtn.addEventListener("click", () => {
  uploadModal.style.display = "flex";
});

// Close modal
function closeModal() {
  uploadModal.style.display = "none";
}

modalCloseBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

// Image upload
const chooseImgBtn = document.getElementById("chooseImgBtn");
const bannerImageInput = document.getElementById("bannerImageInput");

chooseImgBtn.addEventListener("click", () => {
  bannerImageInput.click();
});

bannerImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const previewImg = document.getElementById("previewImg");

  // Create temporary preview URL
  const imgURL = URL.createObjectURL(file);

  // Set image preview
  previewImg.src = imgURL;
  previewImg.style.display = "block";
});


const bannersGrid = document.getElementById("bannersGrid");
const saveBtn = document.getElementById("saveBannerBtn");

saveBtn.addEventListener("click", () => {
  const title = document.getElementById("bannerTitle").value.trim();
  const desc = document.getElementById("bannerDesc").value.trim();
  const url = document.getElementById("bannerURL").value.trim();
  const file = document.getElementById("bannerImageInput").files[0];

  // basic validation
  if (!title || !file) {
    alert("Please enter a title and choose an image.");
    return;
  }

  // preview URL for image
  const imgURL = URL.createObjectURL(file);

  // create card HTML
  const card = document.createElement("article");
  card.className = "banner-card";
  card.innerHTML = `
    <div class="banner-media">
      <img src="${imgURL}" alt="${title}" />
    </div>

    <div class="banner-body">
      <h3 class="title">${title}</h3>
      <p class="desc">${desc || ""}</p>
      ${url ? `<a class="link" href="${url}" target="_blank">${url}</a>` : ""}
      <div class="meta">Created: ${new Date().toISOString().slice(0,10)}</div>
    </div>

    <div class="banner-actions">
      <button class="link-btn edit">Edit</button>
      <button class="link-btn disable">Disable</button>
      <button class="link-btn del">🗑</button>
    </div>
  `;

  // add interactions
  card.querySelector(".edit").addEventListener("click", () => alert("Edit (demo)"));
  card.querySelector(".disable").addEventListener("click", () => {
    card.classList.add("inactive");
  });
  card.querySelector(".del").addEventListener("click", () => {
    if (confirm("Delete this banner?")) card.remove();
  });

  // add the new card to grid
  bannersGrid.prepend(card);

  // close modal
  uploadModal.style.display = "none";

  // clear form
  document.getElementById("bannerTitle").value = "";
  document.getElementById("bannerDesc").value = "";
  document.getElementById("bannerURL").value = "";
  document.getElementById("bannerImageInput").value = "";
});
