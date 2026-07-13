import { apiRequest, clearAuthToken, setAuthToken } from './api';

export async function loginUser(email, password) {
  const response = await apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  const token = response?.data?.token;
  const user = response?.data?.usuario;

  if (!token) {
    throw new Error('El servidor no devolvio un token de acceso.');
  }

  setAuthToken(token);
  return { token, user };
}

export async function registerUser({ name, email, password, passwordConfirmation }) {
  const response = await apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify({
      nombre: name,
      email,
      password,
      password_confirmation: passwordConfirmation
    })
  });

  const token = response?.data?.token;
  const user = response?.data?.usuario;

  if (!token) {
    throw new Error('El servidor no devolvio un token de acceso.');
  }

  setAuthToken(token);
  return { token, user };
}

export async function logoutUser() {
  try {
    await apiRequest('/logout', { method: 'POST' });
  } finally {
    clearAuthToken();
  }
}
