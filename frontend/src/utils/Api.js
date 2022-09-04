class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  getDataUser(token) {
    return fetch(`${this._url}users/me`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Bearer ${token}`
      }
    }).then(this._errorHandler);
  }

  getDataInitialCards(token) {
    return fetch(`${this._url}cards`, {
      method: "GET",
      headers: {
        ...this._headers,
      authorization: `Bearer ${token}`
    },
    }).then(this._errorHandler);
  }

  getData() { 
    return Promise.all([this.getInitialCards(), this.getInitialUser()]) 
  } 

  addCard(data, token) {
    return fetch(`${this._url}cards`, {
      method: "POST",
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    }).then(this._errorHandler);
  }

  deleteCard(id, token) {
    return fetch(`${this._url}cards/${id}`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
    }).then(this._errorHandler);
  }

  toggleLike(id, status, token) {
    return fetch(`${this._url}cards/${id}/likes`, {
      method: status ? "DELETE" : "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
    }).then(this._errorHandler);
  }

  changeAvatar(data, token) {
    return fetch(`${this._url}users/me/avatar`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    }).then(this._errorHandler);
  }

  _errorHandler = (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Произошла ошибка");
  };

  changeUser(data, token) {
    return fetch(`${this._url}users/me`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    }).then(this._errorHandler);
  }
}

export const api = new Api({
  url: "https://domainname.mmuravyev.nomoredomains.sbs/",
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  },
})