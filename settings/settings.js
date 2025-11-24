// settings.js - small demo interactions for Settings page

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const twofaToggle = document.getElementById('twofaToggle');
  const twofaStatus = document.getElementById('twofaStatus');

  const updatePasswordBtn = document.getElementById('updatePasswordBtn');
  const pwdMsg = document.getElementById('pwdMsg');

  const maxSpeed = document.getElementById('maxSpeed');
  const delayTol = document.getElementById('delayTol');
  const geofenceTol = document.getElementById('geofenceTol');

  const gpsFreq = document.getElementById('gpsFreq');
  const dataRetention = document.getElementById('dataRetention');
  const minAppVersion = document.getElementById('minAppVersion');

  const saveSystemBtn = document.getElementById('saveSystemBtn');

  // Init state from localStorage (demo)
  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem('settings_demo') || '{}');
      if (s.maxSpeed) maxSpeed.value = s.maxSpeed;
      if (s.delayTol) delayTol.value = s.delayTol;
      if (s.geofenceTol) geofenceTol.value = s.geofenceTol;
      if (s.gpsFreq) gpsFreq.value = s.gpsFreq;
      if (s.dataRetention) dataRetention.value = s.dataRetention;
      if (s.minAppVersion) minAppVersion.value = s.minAppVersion;
      if (s.twofaEnabled !== undefined) {
        twofaToggle.checked = s.twofaEnabled;
        twofaStatus.textContent = s.twofaEnabled ? 'Enabled' : 'Disabled';
        twofaStatus.className = s.twofaEnabled ? 'pill-sent' : 'pill-scheduled';
      }
    } catch (err) { console.warn('load state err', err); }
  }

  loadState();

  // 2FA toggle
  twofaToggle.addEventListener('change', () => {
    const enabled = twofaToggle.checked;
    twofaStatus.textContent = enabled ? 'Enabled' : 'Disabled';
    twofaStatus.className = enabled ? 'pill-sent' : 'pill-scheduled';
    // persist demo state
    saveDemoState();
  });

  // update password (demo)
  updatePasswordBtn.addEventListener('click', () => {
    const cur = document.getElementById('currentPassword').value;
    const nw = document.getElementById('newPassword').value;
    const conf = document.getElementById('confirmPassword').value;

    pwdMsg.style.color = '#6b7280';
    if (!cur || !nw || !conf) {
      pwdMsg.textContent = 'Please fill all password fields.';
      pwdMsg.style.color = '#ef4444';
      return;
    }
    if (nw !== conf) {
      pwdMsg.textContent = 'New passwords do not match.';
      pwdMsg.style.color = '#ef4444';
      return;
    }
    // demo success
    pwdMsg.textContent = 'Password updated (demo).';
    pwdMsg.style.color = '#16a34a';
    // clear fields
    setTimeout(() => {
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
      pwdMsg.textContent = '';
    }, 1800);
  });

  // Save system settings (demo)
  saveSystemBtn.addEventListener('click', () => {
    // basic validation
    if (!minAppVersion.value.trim()) {
      alert('Please enter minimum conductor app version.');
      return;
    }
    saveDemoState();
    saveSystemBtn.textContent = 'Saved ✓';
    saveSystemBtn.disabled = true;
    setTimeout(() => {
      saveSystemBtn.textContent = 'Save System Configuration';
      saveSystemBtn.disabled = false;
    }, 1200);
  });

  function saveDemoState() {
    const s = {
      maxSpeed: maxSpeed.value,
      delayTol: delayTol.value,
      geofenceTol: geofenceTol.value,
      gpsFreq: gpsFreq.value,
      dataRetention: dataRetention.value,
      minAppVersion: minAppVersion.value,
      twofaEnabled: twofaToggle.checked
    };
    localStorage.setItem('settings_demo', JSON.stringify(s));
  }

});
