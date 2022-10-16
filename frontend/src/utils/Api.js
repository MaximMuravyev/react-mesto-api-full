class Api {
  constructor(config) {
    this._url = config.url;
    this._getResponseData = this._getResponseData.bind(this);
  }

  getDataUser() {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
    }).then(this._getResponseData);
  }

  getDataInitialCards() {
    return fetch(`${this._url}/cards`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
    }).then(this._getResponseData);
  }

  getData() { 
    return Promise.all([this.getInitialCards(), this.getInitialUser()]) 
  } 

  addCard(data) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(this._getResponseData);
  }

  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
    }).then(this._getResponseData);
  }

  toggleLike(id, status) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      method: status ? "DELETE" : "PUT",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
    }).then(this._getResponseData);
  }

  changeAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(this._getResponseData);
  }

  _getResponseData = (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Произошла ошибка");
  };

  changeUser(data) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(this._getResponseData);
  }
}

export const api = new Api({
  url: "https://api.domainname.mmuravyev.nomoredomains.sbs",
})