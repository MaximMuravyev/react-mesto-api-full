export const BASE_URL = "https://api.domainname.mmuravyev.nomoredomains.sbs";

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
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

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json",
    },
}).then(checkRes);
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then(checkRes);
}