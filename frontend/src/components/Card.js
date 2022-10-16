import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import React, { useContext } from "react";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner === currentUser._id;

  const cardDeleteButtonClassName = (
    `card__recycle ${isOwn ? 'card__recycle' : 'card__recycle_hidden'}`
  );

  const isLiked = card.likes.some(i => i === currentUser._id);

  const cardLikeButtonClassName = (
    `card__like ${isLiked ? "card_like-on" : "card__like"}`
  )

  function handleCardClick() {
    onCardClick(card)
  }

  function handleCardLike() {
    onCardLike(card)
  }

  function handleCardDelete() {
    onCardDelete(card);
  }

  return (
    <article className="card">
      <img
        className="card__image"
        alt={card.name}
        src={card.link}
        onClick={handleCardClick} />
      <div className="card__string">
        <h2 className="card__title">{card.name}</h2>
        <div className="card__container">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleCardLike}>
          </button>
          <h3 className="card__like-number" name="likes">{card.likes.length}</h3>
        </div>
      </div>
      <button
        type="reset"
        aria-label="Удалить"
        className={cardDeleteButtonClassName}
        onClick={handleCardDelete}>
      </button>
    </article>
  );
}

export default Card