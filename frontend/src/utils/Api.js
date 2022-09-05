class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
    this._authorization = config.authorization;
  }

  getDataUser(token) {
    return fetch(`${this._url}users/me`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Bearer ${token}`
      }
    })
    .then(this._errorHandler)
  }

  getDataInitialCards(token) {
    return fetch(`${this._url}cards`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Bearer ${token}`,
      }
    })
    .then(this._errorHandler)
  }

  addCard(data, token) {
    return fetch(`${this._url}cards`, {
        method: 'POST',
        headers: {
          ...this._headers,
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    })
        .then(this._errorHandler);
  }

  deleteCard(id, token) {
    return fetch(`${this._url}cards/${id}`, {
        method: 'DELETE',
        headers: {
          ...this._headers,
          authorization: `Bearer ${token}`,
        }
    })
        .then(this._errorHandler);
  }

  toggleLike(id, status, token) {
    return fetch(`${this._url}cards/${id}/likes`, {
      method: status ? "DELETE" : "PUT",
      headers: {
        authorization: `Bearer ${token}`
      },
    })
    .then(this._errorHandler);
  }

  changeAvatar(data, token) {
    return fetch(`${this._url}users/me/avatar`, {
        method: 'PATCH',
        headers: {
            ...this._headers,
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify((data)),
    })
        .then(this._errorHandler);
  }

  _errorHandler = (response) => {
    if (response.ok) {
      return response.json();
    }
      return Promise.reject(`Произошла ошибка ${response.status}`);
  };

  changeUser(data, token) {
    return fetch(`${this._url}users/me`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    })
    .then(this._errorHandler);
  }
}

export const api = new Api({
  url: "https://api.domainname.mmuravyev.nomoredomains.sbs/",
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})