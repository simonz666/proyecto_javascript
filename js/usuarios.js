document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth('../index.html')) return;

  const form = document.getElementById('user-form');
  const formTitle = document.getElementById('user-form-title');
  const idInput = document.getElementById('user-id');
  const identificationInput = document.getElementById('user-identification');
  const fullNameInput = document.getElementById('user-fullname');
  const emailInput = document.getElementById('user-email');
  const phoneInput = document.getElementById('user-phone');
  const roleInput = document.getElementById('user-role');
  const passwordInput = document.getElementById('user-password');
  const cancelBtn = document.getElementById('user-cancel-btn');
  const feedbackEl = document.getElementById('user-feedback');
  const tbody = document.getElementById('users-table-body');

  function resetForm() {
    form.reset();
    idInput.value = '';
    formTitle.textContent = 'Crear Usuario';
  }

  function renderUsers() {
    const users = getData(STORAGE_KEYS.USERS);
    tbody.replaceChildren();

    users.forEach((user) => {
      const tr = document.createElement('tr');
      const cells = [
        user.identification,
        user.fullName,
        user.email,
        user.phone,
        user.role
      ];

      cells.forEach((value) => {
        const td = document.createElement('td');
        td.textContent = value;
        tr.appendChild(td);
      });

      const actionsTd = document.createElement('td');

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'Actualizar';
      editBtn.addEventListener('click', () => {
        idInput.value = user.id;
        identificationInput.value = user.identification;
        fullNameInput.value = user.fullName;
        emailInput.value = user.email;
        phoneInput.value = user.phone;
        roleInput.value = user.role;
        passwordInput.value = user.password;
        formTitle.textContent = 'Actualizar Usuario';
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.addEventListener('click', () => {
        const updated = getData(STORAGE_KEYS.USERS).filter((u) => u.id !== user.id);
        setData(STORAGE_KEYS.USERS, updated);
        feedbackEl.textContent = 'Usuario eliminado.';
        renderUsers();
      });

      actionsTd.append(editBtn, ' ', deleteBtn);
      tr.appendChild(actionsTd);
      tbody.appendChild(tr);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const users = getData(STORAGE_KEYS.USERS);
    const editingId = idInput.value;

    const payload = {
      id: editingId || `usr-${Date.now()}`,
      identification: identificationInput.value.trim(),
      fullName: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      role: roleInput.value,
      password: passwordInput.value
    };

    if (editingId) {
      const idx = users.findIndex((u) => u.id === editingId);
      if (idx !== -1) users[idx] = payload;
      feedbackEl.textContent = 'Usuario actualizado correctamente.';
    } else {
      users.push(payload);
      feedbackEl.textContent = 'Usuario creado correctamente.';
    }

    setData(STORAGE_KEYS.USERS, users);
    resetForm();
    renderUsers();
  });

  cancelBtn.addEventListener('click', () => {
    resetForm();
    feedbackEl.textContent = '';
  });

  renderUsers();
});