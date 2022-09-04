import { CurrentUserContext } from "../contexts/CurrentUserContext";
import React, { useContext } from "react";
import Card from "./Card";

function Main({
  onEditAvatar,
  onEditProfile,
  onCardClick,
  onAddPlace,
  cards,
  onCardLike,
  onCardDelete
}) {

  const cardsElements = cards.map((card) => ( 
    <Card
      card={card}
      key={card._id}
      onCardClick={onCardClick}
      onCardLike={onCardLike}
      onCardDelete={onCardDelete}
    />
  ));

  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profiles">
        <div className="profile">
          <img className="profile__pic" src={currentUser.avatar} alt="аватар профиля" />
          <button type="button" className="profile__pic-button" onClick={onEditAvatar}></button>
          <div className="profile__info">
            <div className="profile__name-content">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                className="profile__edit-button"
                type="button"
                aria-label="Редактировать"
                onClick={onEditProfile}></button>
            </div>
            <p className="profile__job">{currentUser.about}</p>
          </div>
        </div>
        <button
          className="profiles__add-button"
          type="button"
          aria-label="Добавить"
          onClick={onAddPlace}></button>
      </section>
      <section className="cards-list">
        <ul className="cards">
          {cardsElements}
        </ul>
      </section>
    </main>
  );
}

export default Main