class Api {
  constructor(config) {
    this._baseUrl = config.baseUrl;
    this._getResponseData = this._getResponseData.bind(this);
  }

  getDataUser() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
    }).then(this._getResponseData);
  }

  getDataInitialCards() {
    return fetch(`${this._url}cards`, {
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
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this._getResponseData);
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
    }).then(this._getResponseData);
  }

  toggleLike(id, isLiked) {
    if (isLiked) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      }).then(this._getResponseData);
    } else {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      }).then(this._getResponseData);
    }
  }

  changeAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this._getResponseData);
  }

  _getResponseData = (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  };

  changeUser(data) {
    return fetch(`${this._url}users/me`, {
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
  baseUrl: "https://api.domainname.mmuravyev.nomoredomains.sbs",
})