const STORAGE_KEYS = {
  USERS: 'acme_users',
  SESSION: 'acme_session',
  EXAMS: 'acme_exams'
};

const DEFAULT_USERS = [
  {
    id: '1',
    identification: '12345',
    fullName: 'pedrito la cabra',
    email: 'email@colegio.co',
    phone: '3001112233',
    role: 'Administrativo',
    password: '123'
  },
  {
    id: '2',
    identification: '23456',
    fullName: 'el diablo waza',
    email: 'docente@colegio.co',
    phone: '3004445566',
    role: 'Docente',
    password: '123'
  }
];



function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(DEFAULT_EXAMS));
  }
}

function getData(key) {
  initStorage();
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSession() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION)) || null;
}

function setSession(user) {
  const safeSession = {
    id: user.id,
    identification: user.identification,
    fullName: user.fullName,
    email: user.email,
    role: user.role
  };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(safeSession));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

initStorage();