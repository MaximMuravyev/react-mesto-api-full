export const BASE_URL = "https://api.artyom.trus.nomoredomains.icu";

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password}),
  }).then(checkRes);
};

const checkRes = (response) => {
  return response.ok
    ? response.json()
    : Promise.reject(`Ошибка: ${response.status}`);
};

export const checkToken = (jwt) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json",
    },
}).then(checkRes);
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(checkRes);
}