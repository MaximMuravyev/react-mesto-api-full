import React, { useEffect, useState } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddCard }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setLink('');
    }
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddCard({ name, link })
  }

  function handleAddPlaceName(evt) {
    setName(evt.target.value)
  }

  function handleAddPlaceLink(evt) {
    setLink(evt.target.value)
  }

  return (
    <PopupWithForm
      name="popup_card_add"
      title="Новое место"
      form="form-place"
      btnText="Cоздать"
      isOpen={isOpen}
      onClose={onClose}
      onSubmitForm={handleSubmit}>
      <input
        className="popup__input popup__input_type_place"
        id="place"
        name="name"
        type="text"
        onChange={handleAddPlaceName}
        value={name}
        required
        minLength="2"
        maxLength="30"
        autoComplete="off"
        placeholder="Название" />
      <span
        className="popup__input-error place-input-error"
        id="place-error">
      </span>
      <input
        className="popup__input popup__input_type_link"
        id="link"
        name="link"
        type="url"
        onChange={handleAddPlaceLink}
        value={link}
        required
        minLength="2"
        autoComplete="off"
        placeholder="Ссылка на картинку" />
      <span
        className="popup__input-error url-input-error"
        id="link-error">
      </span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
