class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
    this._authorization = config.authorization;
  }

  getDataUser() {
    return fetch(`${this._url}users/me`, {
      method: "GET",
      headers: this._headers,
    }).then(this._errorHandler);
  }

  getDataInitialCards() {
    return fetch(`${this._url}cards`, {
      method: "GET",
      headers: this._headers,
    }).then(this._errorHandler);
  }

  getData() { 
    return Promise.all([this.getInitialCards(), this.getInitialUser()]) 
  } 

  addCard(data) {
    return fetch(`${this._url}cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._errorHandler);
  }

  deleteCard(id) {
    return fetch(`${this._url}cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._errorHandler);
  }

  toggleLike(id, status) {
    return fetch(`${this._url}cards/${id}/likes`, {
      method: status ? "DELETE" : "PUT",
      headers: this._headers,
    }).then(this._errorHandler);
  }

  changeAvatar(data) {
    return fetch(`${this._url}users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._errorHandler);
  }

  _errorHandler = (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Произошла ошибка");
  };

  changeUser(data) {
    return fetch(`${this._url}users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._errorHandler);
  }
}

export const api = new Api({
  url: "https://domainname.mmuravyev.nomoredomains.sbs",
  headers: {
    authorization: "6215e113-b3a7-4765-975a-b13e8216e343",
    "Content-Type": "application/json"
  },
})