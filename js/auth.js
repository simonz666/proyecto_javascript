function requireAuth(redirectPath = '../index.html') {
  const session = getSession();
  if (!session) {
    window.location.href = redirectPath;
    return null;
  }
  return session;
}

document.addEventListener('DOMContentLoaded', () => {
  const isSubpage = document.body.dataset.subpage === 'true';
  const loginHref = isSubpage ? '../index.html' : 'index.html';
  const session = getSession();

  const sessionText = document.getElementById('session-text');
  if (sessionText && session) {
    sessionText.textContent = `${session.fullName} (${session.role})`;
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      window.location.href = loginHref;
    });
  }

  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  if (session) {
    window.location.href = 'pages/dashboard.html';
    return;
  }

  const errorEl = document.getElementById('login-error');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const users = getData(STORAGE_KEYS.USERS);
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email && u.password === password
    );

    if (!matchedUser) {
      errorEl.textContent = 'Credenciales inválidas. Verifica tu correo y contraseña.';
      return;
    }

    setSession(matchedUser);
    window.location.href = 'pages/dashboard.html';
  });
});