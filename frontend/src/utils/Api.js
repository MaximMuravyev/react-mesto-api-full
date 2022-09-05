class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  getDataInitialCards() {
    return fetch(`${this._url}cards`, {
      method: "GET",
      headers: {
         authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": 'application/json'
      }
    })
    .then(this._errorHandler)
  }

  getDataUser() {
    return fetch(`${this._url}users/me`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": 'application/json'
      }
    })
    .then(this._errorHandler)
  }

  addCard(data) {
    return fetch(`${this._url}cards`, {
        method: 'POST',
        headers: {
            authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            name: data.name,
            link: data.link
        })
    })
        .then(this._errorHandler);
  }

  deleteCard(id) {
    return fetch(`${this._url}cards/${id}`, {
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": 'application/json'
        }
    })
        .then(this._errorHandler);
  }

  toggleLike(id, status, token) {
    return fetch(`${this._url}cards/${id}/likes`, {
      method: status ? "DELETE" : "PUT",
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": 'application/json'
      }
    })
    .then(this._errorHandler);
  }

  changeAvatar(data, token) {
    return fetch(`${this._url}users/me/avatar`, {
        method: 'PATCH',
        headers: {
            authorization: `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            avatar: data.avatar,
        })
    })
        .then(this._errorHandler);
  }

  _errorHandler = (response) => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(`Произошла ошибка ${response.status}`);
    }
  };

  changeUser(data, token) {
    return fetch(`${this._url}users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
    .then(this._errorHandler);
  }
}

export const api = new Api({
  baseUrl: "https://api.domainname.mmuravyev.nomoredomains.sbs/",
  headers: {
    authorization: `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json",
  },
})