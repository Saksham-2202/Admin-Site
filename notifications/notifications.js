// notifications.js - interactions for notifications page
document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('ntTitle');
  const message = document.getElementById('ntMessage');
  const charCount = document.getElementById('charCount');
  const audience = document.getElementById('ntAudience');
  const schedule = document.getElementById('ntSchedule');

  const sendNow = document.getElementById('sendNow');
  const scheduleBtn = document.getElementById('scheduleBtn');
  const recentList = document.getElementById('recentList');

  // ---------------- CHAR COUNTER ----------------
  function updateCount() {
    const len = (message.value || '').length;
    charCount.textContent = `${len}/500`;
    charCount.style.color = len > 500 ? "red" : "";
  }
  message.addEventListener('input', updateCount);

  // ---------------- ADD RECENT NOTIFICATION ----------------
  function addRecent({ titleText, metaText, status, msgText }) {
    const item = document.createElement('div');
    item.className = 'recent-item';

    // store actual message inside dataset for modal
    item.dataset.message = msgText;

    item.innerHTML = `
      <div>
        <div class="r-title">${titleText}</div>
        <div class="r-meta">${metaText}</div>
      </div>
      <div class="r-badges">
        <span class="pill ${status === 'Sent' ? 'sent' : 'scheduled'}">${status}</span>
        <a class="view-detail" href="#">View Details</a>
      </div>
    `;

    // view details click → open modal
    item.querySelector(".view-detail").addEventListener("click", (e) => {
      e.preventDefault();
      openNotifDetails(item);
    });

    recentList.prepend(item);
  }

  // ---------------- VALIDATION ----------------
  function validate() {
    if (!title.value.trim()) { alert('Enter title'); return false; }
    if (!message.value.trim()) { alert('Enter message content'); return false; }
    if (message.value.length > 500) { alert('Message too long'); return false; }
    return true;
  }

  // ---------------- SEND NOW ----------------
  sendNow.addEventListener('click', () => {
    if (!validate()) return;

    const meta = `${audience.value} • ${new Date().toLocaleString()}`;

    addRecent({
      titleText: title.value.trim(),
      metaText: meta,
      status: "Sent",
      msgText: message.value.trim(),
    });

    title.value = "";
    message.value = "";
    schedule.value = "";
    updateCount();
  });

  // ---------------- SCHEDULE ----------------
  scheduleBtn.addEventListener('click', () => {
    if (!validate()) return;

    if (!schedule.value) {
      alert("Choose schedule time or use Send Now");
      return;
    }

    const dt = new Date(schedule.value);
    const meta = `${audience.value} • ${dt.toLocaleString()}`;

    addRecent({
      titleText: title.value.trim(),
      metaText: meta,
      status: "Scheduled",
      msgText: message.value.trim(),
    });

    title.value = "";
    message.value = "";
    schedule.value = "";
    updateCount();
  });

  // ============================================================
  // 🔥 NOTIFICATION DETAILS MODAL (NEW)
  // ============================================================

  const notifOverlay = document.getElementById("notifModalOverlay");
  const notifClose = document.getElementById("notifClose");

  const nmTitle = document.getElementById("nmTitle");
  const nmMessage = document.getElementById("nmMessage");
  const nmAudience = document.getElementById("nmAudience");
  const nmStatus = document.getElementById("nmStatus");
  const nmDate = document.getElementById("nmDate");

  // Open modal with extracted details
  function openNotifDetails(item) {
    const title = item.querySelector(".r-title")?.innerText ?? "";
    const meta = item.querySelector(".r-meta")?.innerText ?? "";

    const [aud, date] = meta.split("•").map(s => s.trim());
    const message = item.dataset.message || "No message saved";

    const statusText = item.querySelector(".pill")?.innerText ?? "";

    nmTitle.textContent = title;
    nmMessage.textContent = message;
    nmAudience.textContent = aud;
    nmDate.textContent = date;

    nmStatus.innerHTML =
      statusText === "Sent"
        ? '<span class="pill-sent">Sent</span>'
        : '<span class="pill-scheduled">Scheduled</span>';

    notifOverlay.style.display = "flex";
  }

  // Close modal
  function closeModal() {
    notifOverlay.style.display = "none";
  }

  notifClose.addEventListener("click", closeModal);
  notifOverlay.addEventListener("click", (e) => {
    if (e.target === notifOverlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Attach modal to existing items at load
  document.querySelectorAll(".recent-item .view-detail").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openNotifDetails(e.target.closest(".recent-item"));
    });
  });

});
