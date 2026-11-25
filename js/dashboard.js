document.addEventListener('DOMContentLoaded', () => {
  const session = requireAuth('../index.html');
  if (!session) return;

  const welcomeEl = document.getElementById('welcome-text');
  if (welcomeEl) {
    welcomeEl.textContent = `Sesión activa: ${session.fullName} — Cargo: ${session.role}`;
  }
});