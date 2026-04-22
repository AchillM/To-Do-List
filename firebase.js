/* ===========================
   TASKR — firebase.js
   Optional Cloud Sync Layer
   ===========================

   Aktifkan Firebase jika ingin sync
   antar device / multi-user.

   SETUP:
   1. Buka https://console.firebase.google.com
   2. Buat project baru → tambah Web App
   3. Copy firebaseConfig dari sana
   4. Uncomment kode di bawah & isi config
   5. Uncomment import di index.html jika pakai module

   DEPENDENCY (tambahkan di index.html sebelum firebase.js):
   <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-app-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-auth-compat.js"></script>
*/

// ─── PASTE CONFIG FIREBASE DI SINI ──────────────────────
/*
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db   = firebase.firestore();
const auth = firebase.auth();

// ── ANONYMOUS AUTH (optional, buat user ID unik) ─────────
auth.signInAnonymously().catch(console.error);

auth.onAuthStateChanged(user => {
  if (!user) return;
  const UID = user.uid;
  window.__firebaseUID = UID;

  // ── LISTEN realtime changes ─────────────────────────────
  db.collection('users').doc(UID).collection('tasks')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const remoteTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Merge dengan localStorage – remote menang
      window.__mergeTasks && window.__mergeTasks(remoteTasks);
    });
});

// ── EXPORT helpers ke window supaya bisa dipanggil app.js ─
window.firebaseSync = {
  save(task) {
    const uid = window.__firebaseUID;
    if (!uid) return;
    db.collection('users').doc(uid).collection('tasks')
      .doc(task.id).set(task, { merge: true });
  },
  delete(taskId) {
    const uid = window.__firebaseUID;
    if (!uid) return;
    db.collection('users').doc(uid).collection('tasks')
      .doc(taskId).delete();
  }
};
*/

// ── SAAT FIREBASE BELUM DIAKTIFKAN ───────────────────────
// app.js tetap berjalan 100% dengan localStorage saja.
// Tidak ada yang perlu diubah di app.js.
window.firebaseSync = null; // placeholder — app.js checks this
