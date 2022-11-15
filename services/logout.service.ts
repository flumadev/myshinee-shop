async function logOut() {
  localStorage.removeItem('@user:id');
  window.location.href = '/admin';
}

export default logOut;
