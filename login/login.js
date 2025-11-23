// login.js - Firebase Auth + Firestore (demo)
// IMPORTANT: Replace the firebaseConfig object with your project's config
// You can also put config in a separate file and import it here.

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  // --- FIREBASE CONFIG: replace these placeholders with your actual config ---
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "hospital-project-54ebd",
    // ... other fields (storageBucket, messagingSenderId, appId)
  };
  // -------------------------------------------------------------------------

  // init
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // elements
  const emailEl = document.getElementById('email');
  const passEl = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const errMsg = document.getElementById('errMsg');

  function showError(msg) {
    errMsg.textContent = msg;
    errMsg.style.color = '#ef4444';
  }
  function clearError() {
    errMsg.textContent = '';
  }

  // On login set: sign in and fetch admin profile from Firestore
  loginBtn.addEventListener('click', async () => {
    clearError();
    const email = emailEl.value.trim();
    const password = passEl.value;

    if (!email || !password) {
      showError('Please enter email and password.');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // get admin user id
      const uid = cred.user.uid;

      // fetch admin profile document (assumes collection "admins" with doc id = uid)
      const adminRef = doc(db, 'admins', uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        // if no admin doc found, sign out and show error
        showError('No admin profile found. Contact developer.');
        await auth.signOut();
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign in';
        return;
      }

      const adminData = adminSnap.data();
      // store some admin info locally (session)
      sessionStorage.setItem('adminProfile', JSON.stringify({
        uid,
        name: adminData.name || adminData.displayName || 'Admin',
        email: adminData.email || email
      }));

      // redirect to dashboard (update path if needed)
      window.location.href = "../dashBoard/dashBoard.html";
    } catch (err) {
      console.error(err);
      showError(err.message || 'Login failed');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign in';
    }
  });

  // If already signed in, redirect automatically (optional)
  onAuthStateChanged(auth, user => {
    if (user) {
      // optionally validate Firestore admin doc quickly then redirect
      // window.location.href = "../dashBoard/dashBoard.html";
    }
  }, err => {
    console.warn('Auth state error', err);
  });

});
