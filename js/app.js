document.addEventListener('DOMContentLoaded', () => {
  const session = JSON.parse(localStorage.getItem('acme_session'));

  // Proteger vista privada: si no hay sesión, volver al Login
  if (!session) {
    window.location.href = '../index.html';
    return;
  }

  const userDisplay = document.getElementById('user-display');
  if (userDisplay) {
    userDisplay.textContent = `Bienvenido, ${session.name} (${session.email})`;
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('acme_session');
      window.location.href = '../index.html';
    });
  }
});