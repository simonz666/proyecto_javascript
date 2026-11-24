const DEFAULT_USERS = [
  {
    email: 'ok@ya.co',
    password: '123',
    name: 'pedrito la cabra',
    role: 'student',
  },
  {
    email: 'okay@a.c',
    password: '666',
    name: 'el diablo waza',
    role: 'student',
  }
];

if (!localStorage.getItem('acme_users')) {
  localStorage.setItem('acme_users', JSON.stringify(DEFAULT_USERS));
}