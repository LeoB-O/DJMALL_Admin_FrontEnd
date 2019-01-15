import fetch from 'utils/fetch';

export function loginByEmail(email, password) {
  const data = {
    email,
    password
  };
  return fetch({
    url: '/login',
    method: 'post',
    data
  });
}

export function logout() {
  return fetch({
    url: '/api/logout',
    method: 'get'
  });
}

export function getInfo(token) {
  return fetch({
    url: '/api/user',
    method: 'get',
    params: { token }
  });
}

