document.addEventListener('DOMContentLoaded', () => {
  // Si ya existe una sesión activa, redirigir directamente al dashboard
  if (localStorage.getItem('acme_session')) {
    window.location.href = 'pages/dashboard.html';
    return;
  }

  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('acme_users')) || [];
    const validUser = users.find(u => u.email === email && u.password === password);

    if (validUser) {
      // Guardar sesión activa (sin la contraseña)
      const sessionData = {
        email: validUser.email,
        name: validUser.name,
        role: validUser.role
      };
      localStorage.setItem('acme_session', JSON.stringify(sessionData));
      window.location.href = 'pages/dashboard.html';
    } else {
      errorMessage.textContent = 'Correo electrónico o contraseña incorrectos.';
    }
  });
});